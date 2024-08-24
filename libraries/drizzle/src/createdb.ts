import {drizzle} from 'drizzle-orm/mysql2';
import {createConnection} from 'mysql2/promise';
import {object, order, serviceOffer, serviceType, user} from './schema';
import {sql} from 'drizzle-orm';

const main = async () => {
  try {
    const client = await createConnection(process.env.DB_URL!);
    const db = drizzle(client, {logger: true});

    const res1 = await db.execute(sql`drop database if exists cleandbnew;`);
    console.log('Database dropped', res1);
    const res2 = await db.execute(sql`create database cleandbnew;`);
    console.log('Database created', res2);
    const res3 = await db.execute(
      sql`CREATE USER 'remrob'@'localhost' IDENTIFIED WITH mysql_native_password BY ${process.env.MYSQL_PASSWORD};`,
    );
    console.log('Privileges are given', res3);

    const res4 = await db.execute(
      sql`GRANT ALL PRIVILEGES ON cleandbnew.* TO 'remrob'@'localhost';`,
    );
    console.log('Privileges are given', res4);
  } catch (e) {
    console.log('Privileges error', e);
  }
};
main()
  .finally(() => process.exit(0))
  .catch((err) => console.log(err));
