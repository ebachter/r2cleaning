import log from '@remrob/log';
import {getRedisClient} from './redisConnection';

log.info('Initializing connection pool...');

export {getRedisClient};
