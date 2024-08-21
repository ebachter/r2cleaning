import log from '@remrob/log';
import {PrismaClient} from '../prisma/pclient';
import {Prisma} from '../prisma/pclient';
import {getRedisClient} from './redisConnection';
export * from './sharedFunctions';
export * from './types/typesMisc';
export * from './types/typesMqtt';
export * from './types/typesOrder';

const {MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD} = process.env;

const config: Prisma.PrismaClientOptions = {
  datasources: {
    r2db: {
      url: `mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}/r2db`,
    },
  },
};
if (process.env.MYSQL_LOG === 'true')
  config.log = [
    {
      emit: 'event',
      level: 'query',
    },
  ];

log.info('Initializing connection pool...');

const prisma = new PrismaClient(config);

export {prisma, Prisma, getRedisClient};
