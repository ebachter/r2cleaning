import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {EntityUser} from './entity/User';
import {Verification} from './entity/Verification';
import {EntityOrder} from './entity/Orders';
import {EntityObject} from './entity/Objects';

const {MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB_MAIN} = process.env;
const mysql = '//remrob:soeinmisst@localhost:3306/r2db';

const AppDataSourceSqlite = new DataSource({
  type: 'mysql',
  host: MYSQL_HOST,
  port: 3306,
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: 'cleandb',
  entities: [EntityUser, Verification, EntityObject, EntityOrder],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
  logging: false,
});

/* const AppDataSourceSqlite = new DataSource({
  type: 'sqlite',
  database: '../../data/cleaning.sqlite',
  entities: [User, Verification, Order],
  synchronize: false,
  logging: false,
}); */

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSourceSqlite.initialize()
  .then(async () => {
    // here you can start to work with your database
    console.log('--typeorm db initialized --');
  })
  .catch((error) => console.log(error));

export default AppDataSourceSqlite;

// export {User, Verification};
