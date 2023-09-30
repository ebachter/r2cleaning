import {z} from 'zod';
import {prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';
import {
  Services_Templates,
  ServicesTemplatesParties,
  TableUsers,
} from '@remrob/mysql';
import {isJsonString} from '@remrob/utils';
import {TRPCError} from '@trpc/server';

export const trpcProServicesRouter = router({
  proServicesPaymentEdit: protectedProcedure
    .input(
      z.object({
        serviceTemplateId: z.number(),
        activation: z.number(),
        frequency: z.enum([
          'minute',
          'hour',
          'day',
          'week',
          'month',
          'quarter',
          'year',
        ]),
        subscription: z.number(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {serviceTemplateId, activation, subscription, frequency} = input;

      await prisma.services_templates.updateMany({
        data: {
          activation_payment: activation,
          subscription_value: subscription,
          subscription_frequency: frequency,
        },
        where: {
          service_template_id: serviceTemplateId,
          user_fk: userId,
        },
      });
    }),

  proServicesLoad: protectedProcedure.query(async ({ctx}) => {
    const {userId} = ctx.session;

    const templates = (await prisma.services_templates.findMany({
      where: {user_fk: userId, terminated_at: null},
    })) as Services_Templates[];

    const parties = (await prisma.$queryRaw`
      SELECT
        ctp.service_template_party_id,
        ctp.service_template_fk,
        ctp.user_fk,
        ctp.role,

        ctp.activation_percent,
        ctp.subscription_percent,
        ctp.sensor_percent,
        u.name,
        u.username
      FROM r2db.services_templates_parties ctp
      INNER JOIN r2db.services_templates ct on ct.service_template_id = ctp.service_template_fk
      INNER JOIN r2db.users u on u.user_id = ctp.user_fk
      WHERE ct.user_fk=${userId};
    `) as (ServicesTemplatesParties & Pick<TableUsers, 'name' | 'username'>)[];

    return {templates, parties};
  }),

  proServiceCodeSet: protectedProcedure
    .input(
      z.object({
        serviceTemplateId: z.number(),
        type: z.literal('schedule').or(z.literal('activation')),
        code: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {serviceTemplateId, code, type} = input;

      await prisma.services_templates.updateMany({
        data: {
          [type === 'schedule'
            ? 'function_code_schedule'
            : 'function_code_activation']: code,
        },
        where: {
          service_template_id: serviceTemplateId,
          user_fk: userId,
        },
      });
    }),
  proServiceActivationConfig: protectedProcedure
    .input(
      z.object({
        serviceTemplateId: z.number(),
        activationConfig: z.any(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {serviceTemplateId, activationConfig} = input;

      await prisma.services_templates.updateMany({
        data: {
          activation_configuration: activationConfig,
        },
        where: {
          service_template_id: serviceTemplateId,
          user_fk: userId,
        },
      });
    }),

  proServiceLoad: protectedProcedure
    .input(
      z.object({
        serviceTemplateId: z.number(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {serviceTemplateId} = input;

      const service_template = await prisma.services_templates.findFirstOrThrow(
        {
          where: {
            service_template_id: serviceTemplateId,
            user_fk: userId,
            terminated_at: null,
          },
        },
      );

      const parties = await prisma.services_templates_parties.findMany({
        select: {
          service_template_party_id: true,
          service_template_fk: true,
          user_fk: true,
          role: true,
          activation_percent: true,
          subscription_percent: true,
          sensor_percent: true,
          users: {
            select: {
              user_image_hash: true,
              name: true,
              username: true,
            },
          },
        },
        where: {
          service_template_fk: serviceTemplateId,
        },
      });

      const models = await prisma.services_templates_models.findMany({
        select: {
          model_fk: true,
          is_bound_service: true,
          sensor_id: true,
          sensor_multiplicator: true,
          models: {
            select: {icon: true, model_name_de: true, model_name_en: true},
          },
        },
        where: {service_template_fk: serviceTemplateId},
      });

      return {service_template, parties, models};
    }),

  proServiceModelAdd: protectedProcedure
    .input(
      z.object({
        serviceTemplateId: z.number(),
        modelId: z.number(),
        mapping: z.string(),
        isBoundService: z.boolean(),
        sensor: z
          .object({id: z.string(), multiplicator: z.number()})
          .optional(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {serviceTemplateId, modelId, mapping, isBoundService, sensor} =
        input;

      if (!isJsonString(mapping)) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Invalid JSON',
        });
      }

      await prisma.services_templates.findFirstOrThrow({
        where: {
          service_template_id: serviceTemplateId,
          user_fk: userId,
        },
      });

      await prisma.services_templates_models.create({
        data: {
          service_template_fk: serviceTemplateId,
          model_fk: modelId,
          mapping,
          is_bound_service: isBoundService,
          sensor_id: sensor?.id || null,
          sensor_multiplicator: sensor?.multiplicator || 0,
        },
      });
    }),

  proServiceModelDel: protectedProcedure
    .input(
      z.object({
        serviceTemplateId: z.number(),
        modelId: z.number(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {serviceTemplateId, modelId} = input;

      await prisma.services_templates_models.deleteMany({
        where: {
          service_template_fk: serviceTemplateId,
          model_fk: modelId,
          services_templates: {
            user_fk: userId,
          },
        },
      });
    }),
});
