import {drizzle} from 'drizzle-orm/mysql2';
import {createPool} from 'mysql2';
import * as schema from './schema';

export default drizzle(createPool(Bun.env.DB_URL!), {
  schema,
  mode: 'default',
  logger: false,
});
export * from './schema';
