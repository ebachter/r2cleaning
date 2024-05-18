import AppDataSourceSqlite from './data-source';
import {Objects} from './entity/Objects';
import {Order} from './entity/Orders';
import {User} from './entity/User';
import {Verification} from './entity/Verification';

// export const seed = () => {
console.log('--seed--');
AppDataSourceSqlite.initialize()
  .then(async () => {
    // here you can start to work with your database

    await AppDataSourceSqlite.manager.clear(Order);
    await AppDataSourceSqlite.manager.clear(Verification);
    await AppDataSourceSqlite.manager.getRepository(User).delete({});
    // await AppDataSourceSqlite.createQueryBuilder()
    //  .delete().from(User).execute();

    if (process.env.NODE_ENV !== 'production') {
      // ADD USERS
      const user = new User();
      user.firstName = 'Max';
      user.lastName = 'Mustermann';
      user.age = 24;
      user.balance = 21.3;
      user.data = [{a: 1, b: 'qwer'}];
      user.phoneNumber = '+491633649875';
      await AppDataSourceSqlite.manager.save(user);

      const user2 = new User();
      user2.firstName = 'Cleaner';
      user2.lastName = 'Copany';
      user2.age = 10;
      user2.balance = 2.5;
      user2.data = [{a: 1, b: 'qwer'}];
      user2.phoneNumber = '+491633649875';
      await AppDataSourceSqlite.manager.save(user2);
      console.log('Users created');

      // ADD OBJECTS
      const object = new Objects();
      object.object_type = 'entrance';
      object.user_fk = user.user_id;
      object.area = 12;
      await AppDataSourceSqlite.manager.save(object);

      const object2 = new Objects();
      object2.object_type = 'appartment';
      object2.user_fk = user.user_id;
      object2.area = 83;
      await AppDataSourceSqlite.manager.save(object2);
      console.log('Objects created');

      // ADD ORDERS
      const order = new Order();
      order.user_fk = user.user_id;
      order.objectType = 'appartment';
      await AppDataSourceSqlite.manager.save(order);

      const order2 = new Order();
      order2.user_fk = user.user_id;
      order2.objectType = 'entrance';
      await AppDataSourceSqlite.manager.save(order2);

      const order3 = new Order();
      order3.user_fk = user.user_id;
      order3.objectType = 'entrance';
      order3.price = 3;
      order3.contractor_fk = user2.user_id;
      await AppDataSourceSqlite.manager.save(order3);
      console.log('Orders created');
    }
    process.exit();
  })
  .catch((error) => console.log(error));
// };
