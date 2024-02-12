import AppDataSourceSqlite from './data-source';
import {Order} from './entity/Order';
import {User} from './entity/User';
import {Verification} from './entity/Verification';

// export const seed = () => {
console.log('--seed--');
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
    process.exit();
  })
  .catch((error) => console.log(error));
// };
