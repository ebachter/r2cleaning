import {z} from 'zod';
import {notifyMasterIfProvision, prisma, Prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';
import {generateObjectPasswordHash} from '@remrob/utils';
import {Services_Templates} from '@remrob/mysql';
// import {notifyMasterIfProvision} from '@remrob/utils';
import log from '@remrob/log';
import {objects as Objects} from '@remrob/mysql';
import invariant from 'ts-invariant';

export const appObjectRegistrationRouter = router({
  appObjectRegistrationCheck: protectedProcedure
    .input(
      z
        .object({
          mqttClientId: z.string(),
          modelId: z.number().int(),
        })
        .partial()
        .refine(
          (data) => data.mqttClientId || data.modelId,
          'Either mqttClientId or modelId should be filled in.',
        ),
    )
    .query(async ({ctx, input: {mqttClientId, modelId}}) => {
      if (modelId) {
        const model = await prisma.models.count({
          where: {model_id: modelId, terminated_at: null},
          take: 1,
        });

        /* const services = await prisma.services_templates.findMany({
          select: {
            service_template_id: true,
            user_fk: true,
            model_fk: true,
            service_template_name: true,
            contract_terms: true,
            currency: true,

            subscription_value: true,
            subscription_frequency: true,
            sensor_id: true,
            sensor_multiplicator: true,

            created_at: true,
            updated_at: true,
            contract_period_days: true,
            automatic_extension: true,
          },
          where: {
            model_fk: modelId,
            bound_contract: 1,
          },
        }); */
        const services = (await prisma.$queryRaw`
          select st.* from r2db.services_templates st
          inner join r2db.services_templates_models stm
          on stm.service_template_fk=st.service_template_id
          where stm.model_fk=${modelId} and stm.is_bound_service=1
        `) as Services_Templates[];

        return {exists: model === 1, services};
      }
      if (mqttClientId) {
        const objectExists = await prisma.objects
          .findFirst({where: {mqtt_client_id: mqttClientId}})
          .then((r) => Boolean(r));
        const provisioned = await prisma.objects_provisions
          .findFirst({where: {slave_mqtt_client_id: mqttClientId}})
          .then((r) => Boolean(r));
        return {available: !objectExists && !provisioned};
      }
    }),

  appObjectDeregister: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userId;
      const objectId = input;

      await prisma.$transaction([
        prisma.objects.updateMany({
          data: {terminated_at: new Date()},
          where: {object_id: objectId, user_fk: userId},
        }),
        prisma.services.updateMany({
          data: {terminated_at: new Date()},
          where: {object_fk: objectId, user_fk: userId},
        }),
      ]);
    }),

  appObjectRegister: protectedProcedure
    .input(
      z
        .object({
          mode: z.enum(['manual', 'search', 'qr']),
          modelId: z.number().int(),
          mqttClientId: z.string(),
          userName: z.string().optional(),
          passWord: z.string().optional(),
          services: z.record(z.string(), z.boolean()).optional(),
        })
        .superRefine((o, ctx) => {
          if (o.mode !== 'search' && (!o.userName || !o.passWord)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'userName and passWord must be provided',
              fatal: true,
            });

            return z.NEVER;
          }
        }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          mode,
          modelId,
          mqttClientId,
          userName,
          passWord,
          services: serviceParams,
        },
      }) => {
        const userId = ctx.session?.userid;
        const language = ctx.session?.language;

        try {
          const modelData = await prisma.models.findUniqueOrThrow({
            select: {
              json_model_full: true,
              object_configuration_initial: true,
            },
            where: {model_id: modelId},
          });

          const objectModel: any = modelData?.json_model_full;
          const objectConfigInit = modelData?.object_configuration_initial;

          const services = (await prisma.$queryRaw`
            select st.* from r2db.services_templates st
            inner join r2db.services_templates_models stm
            on stm.service_template_fk=st.service_template_id
            where stm.model_fk=${modelId} and stm.is_bound_service=1
          `) as Services_Templates[];

          if (
            services.length &&
            services.length !== Object.keys(serviceParams || {}).length
          )
            throw Error('Bound activation services are undefined');

          services.forEach((service) => {
            if (
              serviceParams &&
              !serviceParams[`service:${service.service_template_id}`]
            )
              throw Error('Bound activation services must be accepted');
          });

          const modelName = objectModel.name[language];
          const modelObject: {
            online: null;
            actors: {[k: string]: null};
            sensors: {[k: string]: null};
          } = {
            online: null,
            actors: {},
            sensors: {},
          };

          Object.keys(objectModel.actors || {}).forEach((k) => {
            modelObject.actors[k] = null;
          });
          Object.keys(objectModel.sensors || {}).forEach((s) => {
            modelObject.sensors[s] = null;
          });

          let hashedPassword: string;
          let mqttUserName: string;

          if (mode === 'search') {
            const obj = await prisma.objects_provisions.findFirstOrThrow({
              select: {
                slave_password: true,
                slave_mqtt_user_name: true,
              },
            });

            invariant(
              !obj?.slave_password || !obj?.slave_mqtt_user_name,
              'Activation via search error',
            );
            // if (obj?.slave_password && obj?.slave_mqtt_user_name) {
            hashedPassword = obj.slave_password || '';
            mqttUserName = obj.slave_mqtt_user_name || '';
            // }
          } else {
            if (!passWord || !userName)
              throw Error('Password or userName is not defined');
            hashedPassword = generateObjectPasswordHash(passWord);
            mqttUserName = userName;
          }

          // userid, modelid, serialnr, keyhash, object_name, object_configuration, shared_external_object_data
          const object_configuration = JSON.stringify(modelObject);
          const shared_external_object_data = JSON.stringify(objectConfigInit);

          const newObjectId = await createObject({
            modelId,
            modelName,
            userId,
            mqttClientId,
            mqttUserName,
            object_configuration,
            shared_external_object_data,
            hashedPassword,
            services: services.map((s) => s.service_template_id),
          });
          // Inform master object (remove from public available objects)
          await notifyMasterIfProvision(mqttClientId, 'registered', userId);

          return {objectid: newObjectId, name: modelName};
        } catch (err) {
          log.error(err, 'appObjectRegister');
          return {error: {status: 500}};
        }
      },
    ),
});

const createObject = async ({
  modelId,
  modelName,
  userId,
  mqttClientId,
  mqttUserName,
  object_configuration,
  shared_external_object_data,
  hashedPassword,
  services,
}: {
  modelId: number;
  modelName: string;
  userId: number;
  mqttClientId: string;
  mqttUserName: string;
  object_configuration: string;
  shared_external_object_data: string;
  hashedPassword: string;
  services: number[];
}) => {
  let obj: Objects | undefined;
  await prisma.$transaction(
    async (tx) => {
      obj = await tx.objects.create({
        data: {
          user_fk: userId,
          mqtt_client_id: mqttClientId,
          mqtt_user_name: mqttUserName,
          model_fk: modelId,
          keyhash: hashedPassword,
          object_name: modelName,
          object_configuration,
          shared_external_object_data,
          alerts: {
            onoff: {
              onConnect: {email: false, push: false},
              onDisconnect: {email: false, push: false},
            },
            buttons: {},
            switches: {},
            sensors: {},
          },
        },
      });

      for (const service of services) {
        await tx.$executeRaw`
          INSERT INTO r2db.services(user_fk, object_fk, service_template_fk, contract_accepted_at, next_payment_at)
          SELECT ${userId}, ${obj.object_id}, ${service}, now(), r2db.NextPaymentAt(now(), ct.subscription_frequency)
          FROM r2db.services_templates ct
          WHERE ct.service_template_id = ${service};
        `;

        const servicesAmount = (userid: number) => `
          UPDATE r2db.users SET services_amount = (
            SELECT count(*) FROM r2db.services ca 
            WHERE ca.user_fk=${userid} AND terminated_at is null
          )
          WHERE user_id = ${userid}`;

        const sql = Prisma.sql`${Prisma.raw(servicesAmount(userId))}`;
        await tx.$executeRaw`${sql}`;
      }
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted,
    },
  );
  return obj?.object_id;
};
