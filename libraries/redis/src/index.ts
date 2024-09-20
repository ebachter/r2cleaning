import {fileURLToPath} from 'url';
import {dirname} from 'path';
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(__filename);

import {getRedisClient} from './redisConnection';

console.info('Initializing connection pool...');

export {getRedisClient};
