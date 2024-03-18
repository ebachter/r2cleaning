// import log from '@remrob/log';
// import {register} from '@remrob/shuttle';
// import mysql from 'mysql2/promise';
import 'reflect-metadata';

import DataSource from './data-source';
import {User} from './entity/User';
import {Verification} from './entity/Verification';
import {Order} from './entity/Request';

// const {MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_MAIN} = process.env;

// log.info('Initializing connection pool...');

/* let prisma: PrismaClient<
  Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >; */

export default DataSource;

export {User, Verification, Order};
