import {drizzle} from 'drizzle-orm/mysql2';
import {createConnection} from 'mysql2/promise';
import {sql} from 'drizzle-orm';

const main = async () => {
  try {
    const client = await createConnection(process.env.DB_SERVER!);
    const db = drizzle(client, {logger: false});

    const res1 = await db.execute(
      sql.raw(`drop database if exists ${process.env.DB_NAME};`),
    );
    console.log('Database dropped', res1);
    const res2 = await db.execute(
      sql.raw(`create database ${process.env.DB_NAME};`),
    );
    console.log('Database created', res2);
    const res3 = await db.execute(
      sql`CREATE USER IF NOT EXISTS 'remrob'@'localhost' IDENTIFIED WITH mysql_native_password BY ${process.env.DB_PASSWORD};`,
    );
    console.log('Privileges are given', res3);

    const res4 = await db.execute(
      sql.raw(
        `GRANT ALL PRIVILEGES ON ${process.env.DB_NAME}.* TO 'remrob'@'localhost';`,
      ),
    );
    console.log('Privileges are given', res4);
  } catch (e) {
    console.log('Error', e);
  }
};
main()
  .finally(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
