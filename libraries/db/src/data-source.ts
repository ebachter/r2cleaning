import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {User} from './entity/User';
import {Verification} from './entity/Verification';
import {Order} from './entity/Order';

/* const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'admin',
  database: 'test',
  entities: [User],
  synchronize: true,
  logging: false,
}); */

const AppDataSourceSqlite = new DataSource({
  type: 'sqlite',
  database: '../../data/cleaning.sqlite',
  entities: [User, Verification, Order],
  synchronize: true,
  logging: false,
});

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSourceSqlite.initialize()
  .then(async () => {
    // here you can start to work with your database

    await AppDataSourceSqlite.manager.clear(User);
    await AppDataSourceSqlite.manager.clear(Verification);
    await AppDataSourceSqlite.manager.clear(Order);
    // await AppDataSourceSqlite.createQueryBuilder()
    //  .delete().from(User).execute();

    if (process.env.NODE_ENV !== 'production') {
      const user = new User();
      user.firstName = 'Max';
      user.lastName = 'Mustermann';
      user.age = 24;
      user.balance = 21.3;
      user.data = [{a: 1, b: 'qwer'}];
      user.phoneNumber = '+491633649875';
      await AppDataSourceSqlite.manager.save(user);
      console.log('User created');

      const order = new Order();
      order.objectType = 'appartment';
      await AppDataSourceSqlite.manager.save(order);
      console.log('Order created');
    }
  })
  .catch((error) => console.log(error));

export default AppDataSourceSqlite;

// export {User, Verification};
