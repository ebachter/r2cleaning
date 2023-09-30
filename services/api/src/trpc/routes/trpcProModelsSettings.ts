import {z} from 'zod';
import {Prisma, prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';

export const trpcProModelsSettingsRouter = router({
  adminModelConfigUpdateSaga: protectedProcedure
    .input(
      z.object({
        modelId: z.number().int(),
        configData: z.string(), // z.record(z.string(), z.any()),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {modelId, configData} = input;
      const userId = ctx.session?.userid;

      await prisma.$executeRaw`
      UPDATE r2db.models SET object_configuration_initial = ${configData}
      WHERE user_fk = ${userId} and model_id = ${modelId};
    `;

      return {status: 204};
    }),

  adminModelLabelsUpdateSaga: protectedProcedure
    .input(
      z.object({
        modelId: z.number().int(),
        labels: z.tuple([z.string(), z.string()]).array(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {modelId, labels} = input;
      const userId = ctx.session?.userid;

      const diffValues: string[] = [];
      labels.map(([path, value]) => {
        diffValues.push(`$.${path}`);
        diffValues.push(value);
      });

      await prisma.$executeRaw`
        UPDATE r2db.models SET json_model_full = JSON_REPLACE(json_model_full, 
          ${Prisma.join(diffValues)})
        WHERE user_fk = ${userId} and model_id = ${modelId};`;
    }),

  adminModelSensorLoggingSet: protectedProcedure
    .input(
      z.object({
        modelId: z.number().int(),
        value: z.union([z.literal(0), z.literal(1)]),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {modelId, value} = input;
      const userId = ctx.session?.userid;

      await prisma.models.updateMany({
        data: {
          is_sensor_data_logging: value,
        },
        where: {
          user_fk: userId,
          model_id: modelId,
        },
      });

      return {status: 204};
    }),

  adminModelExternalSet: protectedProcedure
    .input(
      z.object({
        modelId: z.number().int(),
        value: z.union([z.literal(0), z.literal(1)]),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {modelId, value} = input;
      const userId = ctx.session?.userid;

      await prisma.models.updateMany({
        data: {
          is_externally_registerable: value,
        },
        where: {
          user_fk: userId,
          model_id: modelId,
        },
      });
      return {status: 204};
    }),
});
