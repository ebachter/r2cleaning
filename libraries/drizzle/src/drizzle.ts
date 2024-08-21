import {drizzle} from 'drizzle-orm/mysql2';
import {createPool} from 'mysql2';
import * as schema from './schema';

export default drizzle(createPool(process.env.DB_URL!), {
  schema,
  mode: 'default',
  logger: true,
});
export * from './schema';
