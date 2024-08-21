import 'reflect-metadata';

import DataSource from './data-source';
import {EntityUser} from './entity/User';
import {Verification} from './entity/Verification';
import {EntityOrder} from './entity/Orders';
import {EntityObject} from './entity/Objects';
import {EntityServiceTypes} from './entity/ServiceTypes';
import {EntityServiceOffers} from './entity/ServiceOffers';

// const {MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_MAIN} = process.env;

// log.info('Initializing connection pool...');

/* let prisma: PrismaClient<
  Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >; */

export default DataSource;

export {
  EntityUser,
  Verification,
  EntityOrder,
  EntityObject,
  EntityServiceTypes,
  EntityServiceOffers,
};
