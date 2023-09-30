import {z} from 'zod';
import {Prisma, prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';

export const searchServicesRouter = router({
  searchServices: protectedProcedure
    .input(z.object({queryString: z.string().nullable()}))
    .query(async ({ctx, input}) => {
      const userId = ctx.session.userid;
      const {queryString} = input;

      const templates = (await prisma.$queryRaw`
          SELECT service_template_id, u.username, service_template_name, color_avatar_background
          FROM r2db.services_templates ct
          INNER JOIN r2db.users u ON u.user_id = ct.user_fk
          WHERE ct.terminated_at is null AND 
            ${
              queryString !== 'null'
                ? Prisma.sql`ct.service_template_name like ${`%${queryString}%`}` // ct.model_fk = ${queryString} OR
                : Prisma.sql`ct.terminated_at is null and ct.user_fk=${userId}`
            }
          LIMIT 10
        `) as {
        service_template_id: number;
        username: string;
        service_template_name: string;
        color_avatar_background: string;
      }[];

      return {templates};
    }),
  searchService: protectedProcedure
    .input(z.number().int())
    .query(async ({ctx, input}) => {
      const userId = ctx.session.userid;
      const serviceId = input;

      const template = await prisma.services_templates.findFirstOrThrow({
        select: {
          service_template_name: true,
          contract_terms: true,
          currency: true,
          created_at: true,
          updated_at: true,
          contract_period_days: true,
          automatic_extension: true,
          activation_payment: true,
          subscription_value: true,
          subscription_frequency: true,
          color_avatar_background: true,
          users: {
            select: {
              user_image_hash: true,
              username: true,
              name: true,
            },
          },
          activation_configuration: true,
        },
        where: {
          service_template_id: serviceId,
          terminated_at: null,
        },
      });

      const models = await prisma.services_templates_models.findMany({
        select: {
          model_fk: true,
          models: {
            select: {icon: true, model_name_de: true, model_name_en: true},
          },
        },
        where: {service_template_fk: serviceId},
      });

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
          service_template_fk: serviceId,
        },
      });

      return {serviceTemplate: template, parties, models};
    }),
});
