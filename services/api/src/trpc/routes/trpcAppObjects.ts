import {z} from 'zod';
import {
  getRedisClient,
  Prisma,
  prisma,
  sendCommandToObject,
  sharedObjectsGet,
} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';
import {
  // sendCommandToObject,
  // sharedObjectsGet,
  TableModels,
  TableObjects,
  TableProjects,
  TableServices,
  TableServicesTemplates,
  TypeObjectAlerts,
  TypeObjectsProvisions,
} from '@remrob/mysql';
import {generateObjectPasswordHash} from '@remrob/utils';
import {Overwrite} from '@remrob/mysql';

export const appObjectsRouter = router({
  appLoadObjectAlerts: protectedProcedure
    .input(z.number())
    .query(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const objectId = input;

      const object = (await prisma.objects.findFirstOrThrow({
        select: {alerts: true},
        where: {
          object_id: objectId,
          OR: [{user_fk: userId}, {projects: {user_fk: userId}}],
        },
      })) as unknown;

      return object as {alerts: TypeObjectAlerts};
    }),

  appLoadObjectSettings: protectedProcedure
    .input(z.number())
    .query(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const objectId = input;

      const projects = await prisma.projects_users.findMany({
        // select: {},
        include: {
          projects: {select: {name: true, color: true, project_id: true}},
        },
        where: {OR: [{user_fk: userId}, {projects: {user_fk: userId}}]},
      });

      /* const projects = await prisma.projects.findMany({
        // select: {},
        select:{name: true, color:true,project_id:true},
        where: {OR: [{user_fk: userId}, {projects_users: {user_fk: userId}}]},
      }); */

      const projectsArray = projects.map((o) => o.projects.project_id);

      const objectOrig = await prisma.objects.findFirstOrThrow({
        select: {
          mqtt_client_id: true,
          object_id: true,
          model_fk: true,
          object_name: true,
          created_at: true,
          modified_at: true,
          project_fk: true,
          publicly_accessible_data: true,
          features: true,
          object_configuration: true,
          connected_at: true,
          disconnected_at: true,
          models: {
            select: {
              model_name_en: true,
              model_name_de: true,
              icon: true,
              json_model_full: true,
            },
          },
        },
        where: {
          object_id: objectId,
          terminated_at: null,
          OR: [{user_fk: userId}, {project_fk: {in: projectsArray}}],
        },
      });

      // const object = objectOrig as Omit<Temp['models'],'json_model_full'>;
      //{models: {json_model_full: TableModels['json_model_full']}}

      const object = objectOrig as Overwrite<
        typeof objectOrig,
        {
          features: TableObjects['features'];
          publicly_accessible_data: TableObjects['publicly_accessible_data'];
          models: {json_model_full: TableModels['json_model_full']};
        }
      >;

      const provisions = (await prisma.$queryRaw`
        SELECT p.provision_id, p.master_object_fk, p.label, p.slave_mqtt_client_id, obr.model_fk slave_model_fk, ${Prisma.raw(
          `m.json_model_full->>'$.name.${lang}'`,
        )} slave_model_name
        FROM r2db.objects_provisions p
        INNER JOIN r2db.objects_reservations obr ON obr.mqtt_client_id=p.slave_mqtt_client_id
        INNER JOIN r2db.models m ON m.model_id = obr.model_fk
        where p.master_object_fk = ${objectId};
      `) as (Pick<
        TypeObjectsProvisions,
        'provision_id' | 'master_object_fk' | 'label' | 'slave_mqtt_client_id'
      > & {slave_model_fk: string; slave_model_name: string})[];

      const servicesOrig = (await prisma.services.findMany({
        select: {
          service_id: true,
          services_templates: {
            select: {service_template_name: true, service_template_id: true},
          },
          created_at: true,
          updated_at: true,
        },
        where: {
          object_fk: objectId,
          terminated_at: null,
        },
      })) as unknown;

      const services = servicesOrig as (Pick<
        TableServices,
        'service_id' | 'created_at' | 'updated_at'
      > & {
        services_templates: Pick<
          TableServicesTemplates,
          'service_template_name' | 'service_template_id'
        >;
      })[];

      return {object, provisions, services};
    }),
  trpcAppLoadObjects: protectedProcedure.query(async ({ctx}) => {
    const {userId, lang} = ctx.session;

    const objectsData = await sharedObjectsGet(userId, {
      object_id: true,
      mqtt_client_id: true,
      mqtt_user_name: true,
      object_name: true,
      project_fk: true,
      connected_at: true,
      disconnected_at: true,
      projects: {select: {project_id: true, name: true, color: true}},
      models: {
        select: {
          model_name_en: true,
          model_name_de: true,
          icon: true,
          json_model_full: true,
        },
      },
      model_fk: true,
    });

    const objectsOrig = objectsData as unknown;
    const objects = objectsOrig as (Pick<
      TableObjects,
      | 'object_id'
      | 'mqtt_client_id'
      | 'mqtt_user_name'
      | 'object_name'
      | 'project_fk'
      | 'connected_at'
      | 'disconnected_at'
      | 'model_fk'
    > & {models: Pick<TableModels, 'icon' | 'json_model_full'>} & {
      projects: Pick<TableProjects, 'project_id' | 'name' | 'color'>;
    })[];

    return {objects}; // , provisions, services
  }),
  trpcAppObjectProvisionAdd: protectedProcedure
    .input(
      //z.number()
      z.object({
        objectId: z.number().int(),
        mqttClientId: z.string(),
        slaveModelId: z.number().int(),
        label: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {objectId, mqttClientId, slaveModelId, label, password} = input;
      const userId = ctx.session?.userid;

      await prisma.$transaction(async (tx) => {
        await tx.objects_provisions.create({
          data: {
            user_fk: userId,
            master_object_fk: objectId,
            slave_mqtt_client_id: mqttClientId,
            slave_model_fk: slaveModelId,
            slave_password: password,
            label,
          },
        });

        await tx.objects.updateMany({
          data: {
            is_provision_master: 1,
          },
          where: {
            object_id: objectId,
            user_fk: userId,
          },
        });
      });
      //res.status(204).end();
      return {status: 204};
    }),
  trpcAppObjectProvisionDel: protectedProcedure
    .input(
      //z.number()
      z.object({
        objectId: z.number().int(),
        provisionId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {objectId, provisionId} = input;
      const userId = ctx.session?.userid;

      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
          UPDATE r2db.objects SET is_provision_master = 0
          WHERE user_fk = ${userId} and object_id = (
            SELECT master_object_fk FROM r2db.objects_provisions WHERE provision_id = ${provisionId} LIMIT 1
          );
        `;
        await tx.objects_provisions.deleteMany({
          where: {
            user_fk: userId,
            provision_id: provisionId,
            master_object_fk: objectId,
          },
        });
      });
      return {status: 204};
    }),

  /* export function* updateUserObjectData({objectId, data, export_}) {
  yield call(putRequest, {
    url: `/app/objects/${objectId}/data`,
    data: {data, export: export_},
    success: [enqueueSnackbar('success', 'Object data updated')],
    always: [{type: 'LOAD_OBJECT_STORE'}],
  });
} */

  trpcAppObjectDataDel: protectedProcedure
    .input(
      //z.number()
      z.object({
        objectId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {objectId} = input;
      const userId = ctx.session?.userid;
      await prisma.$executeRaw`delete from r2data.cloudStore where user = ${userId} and object = ${objectId}`;
      return {status: 204};
    }),
  trpcAppObjectPublicSet: protectedProcedure
    .input(
      z.object({
        objectId: z.number().int(),
        publicType: z.enum(['private', 'public']),
        switches: z.string().array().optional(),
        sensors: z.string().array().optional(),
        // proto?: {available: boolean}
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {objectId} = input;
      const userId = ctx.session?.userid;

      const {publicType, switches, sensors} = input;
      if (publicType === 'private') {
        await prisma.$executeRaw`
          UPDATE r2db.objects SET publicly_accessible_data = null
          WHERE object_id = ${objectId} and user_fk = ${userId};
        `;
      } else {
        const data = JSON.stringify({switches, sensors});
        await prisma.$executeRaw`
          UPDATE r2db.objects SET publicly_accessible_data = ${data}
          WHERE object_id = ${objectId} and user_fk = ${userId};
        `;
      }

      return {status: 204};
    }),
  trpcAppObjectSettingsUpdate: protectedProcedure
    .input(
      //z.number()
      z
        .discriminatedUnion('oper', [
          z.object({
            oper: z.literal('updateObjectPassword'),
            password: z.string(),
          }),
          z.object({
            oper: z.literal('setObjectName'),
            name: z.string(),
          }),
        ])
        .and(z.object({objectId: z.number().int()})),
    )
    .mutation(async ({ctx, input}) => {
      const {objectId, oper} = input;
      const userId = ctx.session?.userid;

      if (oper === 'updateObjectPassword') {
        const {password} = input;
        const hashedPassword = generateObjectPasswordHash(password);
        await prisma.$queryRaw`
        update r2db.objects set keyhash = ${hashedPassword} where user_fk = ${userId} and object_id = ${objectId}
      `;
      } else if (oper === 'setObjectName') {
        const {name} = input;
        await prisma.$queryRaw`
        update r2db.objects set object_name = ${name} where user_fk = ${userId} and object_id = ${objectId}
      `;
      }

      return {status: 204};
    }),

  trpcAppObjectMasterdataUpdate: protectedProcedure
    .input(
      //z.number()
      z.object({
        // objectId: z.number().int(),
        mqttClientId: z.string(),
        configData: z.any(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {mqttClientId, configData} = input;
      const userId = ctx.session?.userid;

      const updateRes = await prisma.objects.updateMany({
        data: {
          object_configuration: JSON.stringify(configData),
        },
        where: {
          user_fk: userId,
          mqtt_client_id: mqttClientId,
        },
      });
      /* await prisma.$executeRaw`
          update r2db.objects SET object_configuration = ${JSON.stringify(
            configData,
          )} WHERE user_fk = ${userId} and object_id = ${objectId}`; */

      if (updateRes.count === 0) {
        console.error(
          'trpcAppObjectMasterdataUpdate. Incorrect input. No update.',
          ctx,
          input,
        );
        return;
      }
      sendCommandToObject(mqttClientId, {
        command: 'updateObjectMasterData',
        userId: userId,
        data: configData,
      });

      /* redisClient.publish(
        `toObject:${objectId}`,
        JSON.stringify({
          action: 'objectMasterDataUpdate',
          data: configData,
        }),
      ); */
    }),
});
