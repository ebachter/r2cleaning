import log from '@remrob/log';
// import {register} from '@remrob/shuttle';
// import mysql from 'mysql2/promise';
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

/* let prisma: PrismaClient<
  Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >; */

export {prisma, Prisma, getRedisClient};
