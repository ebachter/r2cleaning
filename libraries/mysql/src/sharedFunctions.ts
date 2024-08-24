import {CommandFromUserToObject, CommandToUser} from './mysql';
import {getRedisClient} from './redisConnection';

const redisClient = getRedisClient();

export const sendCommandToObject = (
  mqttClientId: string,
  command: CommandFromUserToObject,
) => {
  redisClient.publish(`toObject:${mqttClientId}`, JSON.stringify(command));
};

export const sendCommandToUser = (userId: number, commands: CommandToUser) => {
  redisClient.publish(`toUser:${userId}`, JSON.stringify(commands));
};
