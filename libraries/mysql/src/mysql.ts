import log from '@remrob/log';
import {getRedisClient} from './redisConnection';
export * from './sharedFunctions';
export * from './types/typesMisc';
export * from './types/typesMqtt';
export * from './types/typesOrder';

const {MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD} = process.env;

log.info('Initializing connection pool...');

export {getRedisClient};
