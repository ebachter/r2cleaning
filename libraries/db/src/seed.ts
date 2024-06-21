import AppDataSourceSqlite from './data-source';
import {EntityObject} from './entity/Objects';
import {EntityOrder} from './entity/Orders';
import {EntityUser} from './entity/User';
import {Verification} from './entity/Verification';

// export const seed = () => {
console.log('--seed--');
AppDataSourceSqlite.initialize()
  .then(async () => {
    // here you can start to work with your database

    await AppDataSourceSqlite.manager.clear(EntityOrder);
    await AppDataSourceSqlite.manager.clear(Verification);
    await AppDataSourceSqlite.manager.getRepository(EntityUser).delete({});
    // await AppDataSourceSqlite.createQueryBuilder()
    //  .delete().from(User).execute();

    if (process.env.NODE_ENV !== 'production') {
      // ADD USERS
      const user = new EntityUser();
      user.firstName = 'Max';
      user.lastName = 'Mustermann';
      user.age = 24;
      user.balance = 21.3;
      user.data = [{a: 1, b: 'qwer'}];
      user.phoneNumber = '+491633649875';
      await AppDataSourceSqlite.manager.save(user);

      const user2 = new EntityUser();
      user2.firstName = 'Cleaner';
      user2.lastName = 'Copany';
      user2.age = 10;
      user2.balance = 2.5;
      user2.data = [{a: 1, b: 'qwer'}];
      user2.phoneNumber = '+491633649875';
      await AppDataSourceSqlite.manager.save(user2);
      console.log('Users created');

      // ADD OBJECTS
      const object: Omit<EntityObject, 'object_id'> = {
        object_type: 'appartment',
        user_fk: user.user_id,
        area: 12,
        address_city: 'grosny',
        address_street: 'Kasiora 16',
        object_details: {
          objectType: 'appartment',
          rooms: [{type: 'bedroom', walls: 'wallpaper', floor: 'laminat'}],
          kitchen: [
            {
              floor: 'tile',
              walls: 'color',
              refrigerator: true,
              sink: true,
              oven: false,
            },
          ],
          restroom: [{floor: 'tile', walls: 'color', toilet: true, bath: true}],
        },
      };
      const objectObj = new EntityObject();
      Object.assign(objectObj, object);

      const obj1 = await AppDataSourceSqlite.manager.save(objectObj);

      const object2: Omit<EntityObject, 'object_id'> = {
        object_type: 'appartment',
        user_fk: user.user_id,
        area: 83,
        address_city: 'argun',
        address_street: 'Ioanisiani 124',
        object_details: {
          objectType: 'office',
          rooms: [{type: 'room', walls: 'wallpaper', floor: 'parket'}],
        },
      };
      const objectObj2 = new EntityObject();
      Object.assign(objectObj2, object2);

      const obj2 = await AppDataSourceSqlite.manager.save(objectObj2);
      console.log('Objects created');

      // ADD ORDERS
      const order = new EntityOrder();
      order.object_fk = obj1.object_id;
      order.user_fk = user.user_id;
      // order.object_type = 'appartment';
      await AppDataSourceSqlite.manager.save(order);

      const order2 = new EntityOrder();
      order2.object_fk = obj1.object_id;
      order2.user_fk = user.user_id;
      // order2.object_type = 'entrance';
      await AppDataSourceSqlite.manager.save(order2);

      const order3 = new EntityOrder();
      order3.object_fk = obj2.object_id;
      order3.user_fk = user.user_id;
      // order3.object_type = 'entrance';
      order3.price = 3;
      order3.contractor_fk = user2.user_id;
      await AppDataSourceSqlite.manager.save(order3);
      console.log('Orders created');
    }
    process.exit();
  })
  .catch((error) => console.log(error));
// };
