import {CommandFromUserToObject, CommandToUser, Prisma, prisma} from './mysql';
import {getRedisClient} from './redisConnection';

const redisClient = getRedisClient();

export const notifyMasterIfProvision = async (
  childMqttClientId: string,
  type: 'registered' | 'unregistered',
  userId: number,
) => {
  const provisionMasterObject = await prisma.objects_provisions.findFirst({
    select: {master_object_fk: true},
    where: {slave_mqtt_client_id: childMqttClientId},
  });
  const masterObjectId = provisionMasterObject?.master_object_fk;
  if (masterObjectId) {
    // Notify frontend
    redisClient.publish(`pblobj:${masterObjectId}`, `provision:${type}`);

    const provisionMasterMqttId = await prisma.objects.findFirstOrThrow({
      select: {mqtt_client_id: true},
      where: {object_id: provisionMasterObject?.master_object_fk},
    });

    const masterMqttClientId = provisionMasterMqttId.mqtt_client_id;
    // Notify IoT object
    sendCommandToObject(masterMqttClientId, {
      command: 'notifyMasterOfProvision',
      childMqttClientId,
      userId,
    });
  }
};

export const sendCommandToObject = (
  mqttClientId: string,
  command: CommandFromUserToObject,
) => {
  redisClient.publish(`toObject:${mqttClientId}`, JSON.stringify(command));
};

export const sendCommandToUser = (userId: number, commands: CommandToUser) => {
  redisClient.publish(`toUser:${userId}`, JSON.stringify(commands));
};

export const sharedObjectsGet = async (
  userId: number,
  columns: Prisma.objectsSelect,
) => {
  const projects = await prisma.projects_users.findMany({
    select: {
      projects: {select: {name: true, color: true, project_id: true}},
    },
    where: {OR: [{user_fk: userId}, {projects: {user_fk: userId}}]},
  });
  const projectsArray = projects.map((o) => o.projects.project_id);

  const objectsData = await prisma.objects.findMany({
    select: columns,
    where: {
      terminated_at: null,
      OR: [{user_fk: userId}, {project_fk: {in: projectsArray}}],
    },
  });

  return objectsData;
};
