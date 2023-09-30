import {
  TableObjects,
  TableServices,
  TableServicesTemplates,
  TableServicesTemplatesModels,
  TableModels,
  prisma,
} from '../mysql';

export const loadUsers = async (projectId: number) => {
  const rslt = await prisma.projects_users.findMany({
    select: {
      user_fk: true,
      access_control: true,
    },
    where: {project_fk: projectId},
  });

  return rslt;
};

export type LoadUsers = Awaited<ReturnType<typeof loadUsers>>;

export const getObjectData = async (
  mqtt_client_id: string,
  mqttUserName: string,
  keyhash: string,
) => {
  console.log('>>', mqtt_client_id, mqttUserName, keyhash);
  const objectData = await prisma.objects.findFirstOrThrow({
    select: {
      object_id: true,
      mqtt_client_id: true,
      user_fk: true,
      object_name: true,
      model_fk: true,
      users: {
        select: {
          email: true,
          user_active: true,
        },
      },
      publicly_accessible_data: true,
      object_configuration: true,
      alerts: true,
      project_fk: true,
    },
    where: {
      mqtt_client_id,
      mqtt_user_name: mqttUserName,
      keyhash,
    },
  });

  type ObjectData = Omit<typeof objectData, 'alerts'> &
    Pick<TableObjects, 'alerts'>;
  const objectDataUnknown = objectData as unknown;

  return objectDataUnknown as ObjectData;
};

export type GetObjectData = Awaited<ReturnType<typeof getObjectData>>;

export const loadModelData = async (modelid: number) => {
  const modelData = await prisma.models.findUniqueOrThrow({
    select: {
      is_sensor_data_logging: true,
      ext_service_data: true,
      ext_service_mapping: true,
      mapping_in: true,
      mapping_out: true,
      initial_commands: true,
      json_model_full: true,
    },
    where: {
      model_id: modelid,
    },
  });

  type ModelData = Omit<
    typeof modelData,
    | 'ext_service_mapping'
    | 'mapping_in'
    | 'mapping_out'
    | 'json_model_full'
    | 'initial_commands'
  > &
    Pick<
      TableModels,
      | 'ext_service_mapping'
      | 'mapping_in'
      | 'mapping_out'
      | 'json_model_full'
      | 'initial_commands'
    >;

  const modelDataUnknown = modelData as unknown;

  return modelDataUnknown as ModelData;
};

export type LoadModelData = Awaited<ReturnType<typeof loadModelData>>;

export const loadSensorBasedContracts = async (objectId: number) => {
  const rslt = (await prisma.$queryRaw`
      SELECT 
        ca.service_id,
        ca.latest_sensor_value,
        stm.sensor_id,
        stm.sensor_multiplicator,
        ct.user_fk user_to,
        ca.user_fk user_from
      FROM r2db.services ca
      INNER JOIN r2db.services_templates ct ON ca.service_template_fk = ct.service_template_id
      INNER JOIN r2db.services_templates_models stm ON stm.service_template_fk=ct.service_template_id
      WHERE stm.sensor_id IS NOT NULL AND ca.terminated_at IS NULL AND ca.object_fk = ${objectId};
    `) as unknown;

  const services = rslt as (Pick<
    TableServices,
    'service_id' | 'latest_sensor_value'
  > &
    Pick<TableServicesTemplatesModels, 'sensor_id' | 'sensor_multiplicator'> & {
      user_to: number;
      user_from: number;
    })[];

  return services;
};

export type LoadSensorBasedContracts = Awaited<
  ReturnType<typeof loadSensorBasedContracts>
>;
