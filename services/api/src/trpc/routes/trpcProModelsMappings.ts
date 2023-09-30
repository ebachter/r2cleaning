import {z} from 'zod';
import {Prisma, prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';

const reverseObject = (obj: any) =>
  Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));

export const trpcProModelsMappinsRouter = router({
  proModelMappingInitAdd: protectedProcedure
    .input(
      z.object({
        modelId: z.number().int(),
        elementValue: z.object({
          topic: z.string(),
          payload: z.string().nullable(),
        }), // z.record(z.string(), z.any()),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {modelId, elementValue} = input;
      const userId = ctx.session?.userid;
      const payload = JSON.stringify({
        payload: elementValue.payload || null,
      });

      await prisma.$executeRaw`
      UPDATE r2db.models
      SET initial_commands = JSON_SET(IFNULL(initial_commands,'{}' ), '$."${Prisma.raw(
        elementValue.topic,
      )}"', CAST('${Prisma.raw(payload)}' AS JSON))
      WHERE user_fk = ${userId} and model_id = ${modelId};
    `;

      return {status: 204};
    }),

  proMappingDel: protectedProcedure
    .input(
      z
        .discriminatedUnion('mode', [
          z.object({mode: z.literal('in'), topic: z.string()}),
          z.object({mode: z.literal('out'), element: z.string()}),
          z.object({mode: z.literal('ini'), topic: z.string()}),
        ])
        .and(
          z.object({
            modelId: z.number().int(),
          }),
        ),
    )
    .mutation(async ({ctx, input}) => {
      const {modelId, mode} = input;
      const userId = ctx.session?.userid;

      if (mode === 'in') {
        const {topic} = input;
        await prisma.$executeRaw`
            UPDATE r2db.models
            SET mapping_in = JSON_REMOVE(mapping_in, ${`$."${topic}"`})
            WHERE user_fk = ${userId} and model_id = ${modelId};
          `;
      }
      if (mode === 'out') {
        const {element} = input;
        await prisma.$executeRaw`
              UPDATE r2db.models
              SET mapping_out = JSON_REMOVE(mapping_out, ${`$."${element}"`})
              WHERE user_fk = ${userId} and model_id = ${modelId};
            `;
      }
      if (mode === 'ini') {
        const {topic} = input;
        await prisma.$executeRaw`
              UPDATE r2db.models
              SET initial_commands = JSON_REMOVE(initial_commands, ${`$."${topic}"`})
              WHERE user_fk = ${userId} and model_id = ${modelId};
            `;
      }
    }),

  trpcProModelMappingAdd: protectedProcedure
    .input(
      z.object({
        modelId: z.number().int(),
        topic: z.string(),
        direction: z.enum(['in', 'out']),
        path: z.string().optional(),
        switch: z
          .object({
            switchId: z.string(),
            states: z.record(z.string(), z.string()).optional(),
            taskslist: z.record(z.string(), z.string()).optional(),
          })
          .optional(),
        button: z
          .object({
            buttonId: z.string(),
            states: z.record(z.string(), z.string()).optional(),
            mqttValueForButton: z.string().optional(),
          })
          .optional(),
        sensorId: z.string().optional(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {
        modelId,
        topic,
        direction,
        switch: switchEl,
        button,
        sensorId,
        path,
      } = input;
      const userId = ctx.session?.userid;

      let inMapping: {
        [topic: string]: {
          path?: string;
          buttonid?: string;
          sensorid?: string;
          actorid?: string;
          states?: Record<string, string>;
        };
      } = {};

      const mappings = (await prisma.models.findFirstOrThrow({
        select: {mapping_in: true, mapping_out: true},
        where: {user_fk: userId, model_id: modelId},
      })) as any;

      if (direction === 'in') {
        inMapping = {...mappings.mapping_in};
        if (button) {
          inMapping[topic] = {
            ...(path && {path}),
            buttonid: button.buttonId,
            states: reverseObject(button.states),
          };
        }

        if (switchEl) {
          inMapping[topic] = {
            ...(path && {path}),
            actorid: switchEl.switchId,
            states: reverseObject(switchEl.states),
          };
        }
        if (sensorId) {
          // newMapping[topic].type = 'sensor';
          inMapping[topic] = {
            ...(path && {path}),
            sensorid: sensorId,
          };
          // newMapping[topic].sensorid = sensorid;
        }
        await prisma.$executeRaw`
          UPDATE r2db.models SET mapping_in = ${JSON.stringify(inMapping)}
          WHERE user_fk = ${userId} and model_id = ${modelId};
        `;
      }

      let outMapping: {
        [commponent: string]: {
          tasks?: Record<string, string>;
          topic: string;
          payload?: string;
        };
      } = {};

      if (direction === 'out') {
        inMapping = {...mappings.mapping_out};
        // const {topic, command, buttonid, actorid, taskslist} = input;
        if (switchEl) {
          outMapping[`actor/${switchEl.switchId}`] = {
            topic,
            tasks: switchEl.taskslist,
          };
        }
        if (button) {
          outMapping[`button/${button.buttonId}`] = {
            topic,
            ...(button.mqttValueForButton && {
              payload: button.mqttValueForButton,
            }),
            // command,
          };
        }
        await prisma.$executeRaw`
          UPDATE r2db.models SET mapping_out = ${JSON.stringify(outMapping)}
          WHERE user_fk = ${userId} and model_id = ${modelId};
        `;
      }
    }),
});
