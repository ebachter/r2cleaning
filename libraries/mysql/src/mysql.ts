import log from '@remrob/log';
import {getRedisClient} from './redisConnection';
export * from './types/typesMisc';

log.info('Initializing connection pool...');

export {getRedisClient};
