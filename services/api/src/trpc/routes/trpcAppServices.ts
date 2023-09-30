import {Prisma, prisma} from '@remrob/mysql';
import {services, services_templates, users} from '@remrob/mysql';
import {getRandomColor} from '@remrob/utils';
import {z} from 'zod';
import {router, protectedProcedure, publicProcedure} from '../middleware';
import {VM, VMScript, NodeVM} from 'vm2';

const servicesAmount = (userid: number) => `
UPDATE r2db.users SET services_amount = (
  SELECT count(*) FROM r2db.services ca 
  WHERE ca.user_fk=${userid} AND terminated_at is null
)
WHERE user_id = ${userid}`;

export const trpcAppServicesRouter = router({
  appGetServices: protectedProcedure.query(async ({ctx}) => {
    const services = await prisma.services.findMany({
      select: {
        service_id: true,
        object_fk: true,
        services_templates: {
          select: {
            service_template_name: true,
            color_avatar_background: true,
          },
        },
        user_fk: true,
        service_template_fk: true,
        created_at: true,
        updated_at: true,
      },
      where: {user_fk: ctx.session?.userid, terminated_at: null},
    });

    return services;
  }),

  appGetService: protectedProcedure
    .input(
      z.object({
        serviceId: z.number().int(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {serviceId} = input;

      /* const service = await prisma.services.findFirstOrThrow({
        include:{services_templates:true},
        where:{user_fk:userId,service_id:serviceId}
      }) */
      const service = (await prisma.$queryRaw`
      SELECT
        c.user_fk,
        c.object_fk,
        c.service_template_fk,
        c.created_at,
        c.updated_at,

        ct.subscription_value,
        ct.subscription_frequency,
        ct.sensor_id,
        ct.sensor_multiplicator,

        ct.service_template_id,
        # ct.model_fk,
        ct.service_template_name,
        ct.contract_terms,
        ct.currency,
        ct.contract_period_days,
        ct.automatic_extension,
        ct.color_avatar_background,
        c.next_payment_at,
        c.terminated_at
      FROM r2db.services c
      INNER JOIN r2db.services_templates ct on ct.service_template_id=c.service_template_fk
      WHERE c.user_fk=${userId} and c.service_id=${serviceId};
    `) as (services & services_templates)[];

      const parties = (await prisma.$queryRaw`
      SELECT
        ctp.service_template_party_id,
        ctp.service_template_fk,
        ctp.user_fk,
        ctp.role,

        ctp.activation_percent,
        ctp.subscription_percent,
        ctp.sensor_percent,
        u.username,
        u.user_image_hash,
        u.name
      FROM r2db.services c
      INNER JOIN r2db.services_templates_parties ctp on c.service_template_fk = ctp.service_template_fk
      INNER JOIN r2db.users u ON u.user_id = ctp.user_fk
      WHERE c.user_fk=${userId} and c.service_id=${serviceId};
    `) as (services & users)[];

      return {service: service[0], parties};
    }),

  // ///////////////////////////////////////////

  proContractTerminate: protectedProcedure
    // deleteRequest, `/admin/contracts/${contract_template_id}/terminate`,
    .input(
      z.object({
        serviceTemplateId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {serviceTemplateId} = input;

      await prisma.services_templates.updateMany({
        data: {
          terminated_at: new Date(),
        },
        where: {
          user_fk: userId,
          service_template_id: serviceTemplateId,
        },
      });
    }),

  appContractTerminate: protectedProcedure
    .input(
      z.object({
        serviceId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {serviceId} = input;

      const res = await prisma.$transaction(
        async (tx) => {
          await tx.$executeRaw`
            UPDATE r2db.services SET terminated_at = now() 
            WHERE user_fk = ${userId} and service_id = ${serviceId}
          `;
          const sql = Prisma.sql`${Prisma.raw(servicesAmount(userId))}`;
          await tx.$executeRaw`${sql}`;
          return {status: 204};
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted,
        },
      );
      return res;
    }),

  appContractSign: protectedProcedure
    .input(
      z.object({
        contract_template_id: z.number().int(),
        object_id: z.number().int(),
        accepted: z.literal(true),
        dynamicData: z.record(z.string(), z.string()),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {contract_template_id, object_id, dynamicData} = input;

      const func = await prisma.services_templates.findFirstOrThrow({
        select: {
          function_code_activation: true,
        },
        where: {
          service_template_id: contract_template_id,
        },
      });

      if (func.function_code_activation) {
        const vm = new VM({
          allowAsync: true,
          sandbox: {
            console: {
              log: (...args: any) => {
                console.log(args);
              },
            },
          },
        });
        try {
          const vmv = await vm.run(func.function_code_activation);
          const res = await vmv({dynamicData});
          if (!res) {
            return false;
          }
          // console.log('>>>', res);
        } catch (err) {
          console.log(err);
        }
      }

      const res = await prisma.$transaction(
        async (tx) => {
          await tx.$executeRaw`
          INSERT INTO r2db.services(user_fk, object_fk, service_template_fk, contract_accepted_at, next_payment_at)
          SELECT ${userId}, ${object_id}, ${contract_template_id}, now(), 
          # r2db.NextPaymentAt(now(), ct.subscription_frequency)
          CASE
            WHEN ct.subscription_frequency = 'minute'
            THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 MINUTE)
            WHEN ct.subscription_frequency = 'hour'
            THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 HOUR)
            WHEN ct.subscription_frequency = 'day'
            THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 DAY)
            WHEN ct.subscription_frequency = 'week'
            THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 WEEK)
            WHEN ct.subscription_frequency = 'month'
            THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 MONTH)
            WHEN ct.subscription_frequency = 'quarter'
            THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 QUARTER)
            WHEN ct.subscription_frequency = 'year'
            THEN DATE_ADD(ca.latest_payment_at, INTERVAL 1 YEAR)
            ELSE ct.subscription_frequency
          END
          FROM r2db.services_templates ct
          WHERE ct.service_template_id = ${contract_template_id};
        `;

          const sql = Prisma.sql`${Prisma.raw(servicesAmount(userId))}`;
          await tx.$executeRaw`${sql}`;

          return {status: 204};
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted,
        },
      );

      return res;
    }),

  proServiceTemplateCreate: protectedProcedure
    .input(
      z.object({
        name: z.string().min(5),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {name} = input;

      const res = await prisma.$transaction(async (tx) => {
        const ins = await tx.services_templates.create({
          data: {
            user_fk: userId,
            color_avatar_background: getRandomColor(),
            service_template_name: name,
            contract_terms: '',
            currency: 'EUR',
            activation_payment: 0,
            subscription_value: 0,
            subscription_frequency: 'day',
            activation_configuration: {elements: []},
          },
        });
      });
      return res;
    }),
});
