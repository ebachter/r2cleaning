import log from '@remrob/log';
import {getRedisClient} from './redisConnection';
export * from './types/typesMisc';
export * from './types/typesOrder';

log.info('Initializing connection pool...');

export {getRedisClient};
