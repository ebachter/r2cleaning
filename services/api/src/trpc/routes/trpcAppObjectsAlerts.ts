import {z} from 'zod';
import {prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';
import {TypeObjectAlerts} from '@remrob/mysql';
import _ from 'lodash';
import {Subset} from '@remrob/mysql';

export const trpcAppObjectsAlertsRouter = router({
  appActorAlertDel: protectedProcedure
    .input(
      z.object({
        objectId: z.number(),
        switchId: z.string(),
        stateId: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;
      const {objectId, switchId, stateId} = input;

      const object = await prisma.objects.findFirstOrThrow({
        select: {alerts: true},
        where: {object_id: objectId, user_fk: userId},
      });

      // Set(s) not accepted by prisma -> convert to array
      const alerts = JSON.parse(
        JSON.stringify(object.alerts, (_, value) =>
          value instanceof Set ? [...value] : value,
        ),
      );

      _.unset(alerts, `switches.${switchId}:${stateId}`);

      await prisma.objects.updateMany({
        data: {alerts: alerts},
        where: {object_id: objectId, user_fk: userId},
      });
      return {status: 204};
    }),
  fnsSensorAlertDel: protectedProcedure
    .input(
      z.object({
        objectId: z.number(),
        sensorId: z.string(),
        sign: z.enum(['greater', 'less']),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;
      const {objectId, sensorId, sign} = input;

      const object = await prisma.objects.findFirstOrThrow({
        select: {alerts: true},
        where: {object_id: objectId, user_fk: userId},
      });

      // Set(s) not accepted by prisma -> convert to array
      const alerts = JSON.parse(
        JSON.stringify(object.alerts, (key, value) =>
          value instanceof Set ? [...value] : value,
        ),
      );

      _.unset(alerts, `sensors.${sensorId}.${sign}`);

      await prisma.objects.updateMany({
        data: {alerts: alerts},
        where: {object_id: objectId, user_fk: userId},
      });
      return {status: 204};
    }),

  appActorAlertAdd: protectedProcedure
    .input(
      z.object({
        objectId: z.number(),
        switchId: z.string(),
        stateId: z.string(),
        value: z.set(z.literal('email').or(z.literal('push'))),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;
      const {objectId, switchId, stateId, value} = input;

      const json: Subset<TypeObjectAlerts> = {
        switches: {[`${switchId}:${stateId}`]: [...value]},
      };

      const object = await prisma.objects.findFirstOrThrow({
        select: {alerts: true},
        where: {object_id: objectId, user_fk: userId},
      });

      const temp = _.merge(object.alerts, json);

      await prisma.objects.updateMany({
        data: {alerts: temp},
        where: {object_id: objectId, user_fk: userId},
      });
    }),

  fnSetOnoffAlert: protectedProcedure
    .input(
      z.object({
        objectId: z.number(),
        onEvent: z.enum(['onConnect', 'onDisconnect']),
        alertType: z.enum(['email', 'push']),
        value: z.boolean(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;
      const {objectId, onEvent, alertType, value} = input;

      const json: Subset<TypeObjectAlerts> = {
        onoff: {[onEvent]: {[alertType]: value}},
      };

      const object = await prisma.objects.findFirstOrThrow({
        select: {alerts: true},
        where: {object_id: objectId, user_fk: userId},
      });

      const temp = _.merge(object.alerts, json);

      await prisma.objects.updateMany({
        data: {alerts: temp},
        where: {object_id: objectId, user_fk: userId},
      });
      return {status: 204};
    }),
  fnsSensorAlertAdd: protectedProcedure
    .input(
      z
        .discriminatedUnion('type', [
          z.object({
            type: z.literal('addSensorAlert'),
            sensorId: z.string(),
            sign: z.enum(['greater', 'less']),
            value: z.number(),
            email: z.boolean(),
            push: z.boolean(),
          }),
        ])
        .and(
          z.object({
            objectId: z.number(),
          }),
        ),
    )
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;
      const {objectId, type, email, push} = input;

      if (type === 'addSensorAlert') {
        const {sensorId, sign, value} = input;

        console.log(`$.sensors.${sensorId}.${sign}`, value);

        const json: Subset<TypeObjectAlerts> = {
          sensors: {[sensorId]: {[sign]: {value, channels: {email, push}}}},
        };
        const object = await prisma.objects.findFirstOrThrow({
          select: {alerts: true},
          where: {object_id: objectId, user_fk: userId},
        });

        const temp = _.merge(object.alerts, json);

        await prisma.objects.update({
          data: {alerts: temp},
          where: {object_id: objectId},
        });

        /* await prisma.$executeRaw`
          UPDATE r2db.objects SET alerts = JSON_SET(alerts, ${`$."sensors"`}, CAST('${Prisma.raw(
          json,
        )}' AS JSON))
          WHERE object_id = ${objectId};
        `; */
      }
      return {status: 204};
    }),

  appButtonAlertAdd: protectedProcedure
    .input(
      z.object({
        objectId: z.number(),
        buttonId: z.string(),
        stateId: z.string(),
        value: z.set(z.literal('email').or(z.literal('push'))),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;
      const {objectId, buttonId, stateId, value} = input;

      const json: Subset<TypeObjectAlerts> = {
        buttons: {[`${buttonId}:${stateId}`]: [...value]},
      };

      const object = await prisma.objects.findFirstOrThrow({
        select: {alerts: true},
        where: {object_id: objectId, user_fk: userId},
      });

      const temp = _.merge(object.alerts, json);

      await prisma.objects.updateMany({
        data: {alerts: temp},
        where: {object_id: objectId, user_fk: userId},
      });
    }),

  appButtonAlertDel: protectedProcedure
    .input(
      z.object({
        objectId: z.number(),
        buttonId: z.string(),
        stateId: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;
      const {objectId, buttonId, stateId} = input;

      const object = await prisma.objects.findFirstOrThrow({
        select: {alerts: true},
        where: {object_id: objectId, user_fk: userId},
      });

      // Set(s) not accepted by prisma -> convert to array
      const alerts = JSON.parse(
        JSON.stringify(object.alerts, (_, value) =>
          value instanceof Set ? [...value] : value,
        ),
      );

      _.unset(alerts, `buttons.${buttonId}:${stateId}`);

      await prisma.objects.updateMany({
        data: {alerts: alerts},
        where: {object_id: objectId, user_fk: userId},
      });
    }),
});
