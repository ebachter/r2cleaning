import AppDataSourceSqlite from './data-source';
import {EntityObject} from './entity/Objects';
import {EntityOrder} from './entity/Orders';
import {EntityOrdersServices} from './entity/OrdersServices';
import {EntityServiceOffers} from './entity/ServiceOffers';
import {EntityServiceTypes} from './entity/ServiceTypes';
import {EntityUser} from './entity/User';
import {Verification} from './entity/Verification';
import {object_raw_1, object_raw_2} from './seed_data/seed_objects';
import {order_data_1, order_data_2} from './seed_data/seed_orders';
import {fn_service_offer_1} from './seed_data/seed_service_offers';
import {service_type_1, service_type_2} from './seed_data/seed_service_types';
import {userraw1, userraw2} from './seed_data/seed_users';

// export const seed = () => {
console.log('--seed--');
AppDataSourceSqlite.initialize()
  .then(async () => {
    // here you can start to work with your database

    const tables = [
      EntityOrdersServices,
      EntityServiceOffers,
      EntityServiceTypes,
      EntityObject,
      EntityOrder,
    ];

    for (const table of tables) {
      await AppDataSourceSqlite.manager.getRepository(table).delete({});
    }

    // await AppDataSourceSqlite.manager.getRepository(EntityOrder).delete({});
    // await AppDataSourceSqlite.manager.clear(EntityOrdersServices);

    await AppDataSourceSqlite.manager.clear(Verification);
    await AppDataSourceSqlite.manager.getRepository(EntityUser).delete({});
    console.log('--tables deleted--');
    // await AppDataSourceSqlite.createQueryBuilder()
    //  .delete().from(User).execute();

    if (process.env.NODE_ENV !== 'production') {
      // ADD USERS
      const user1 = await AppDataSourceSqlite.manager.save(userraw1);
      const user2 = await AppDataSourceSqlite.manager.save(userraw2);
      console.log('Users created');

      // ADD OBJECTS
      const obj1 = await AppDataSourceSqlite.manager.save(
        object_raw_1({userId: user1.user_id}),
      );
      const obj2 = await AppDataSourceSqlite.manager.save(
        object_raw_2({userId: user2.user_id}),
      );
      console.log('Objects created');

      // ADD ORDERS
      await AppDataSourceSqlite.manager.save(
        order_data_1({userId: user1.user_id, objectId: obj1.object_id}),
      );
      await AppDataSourceSqlite.manager.save(
        order_data_2({userId: user1.user_id, objectId: obj1.object_id}),
      );
      await AppDataSourceSqlite.manager.save(
        order_data_2({userId: user1.user_id, objectId: obj2.object_id}),
      );
      console.log('Orders created');

      // SERVICE TYPES
      const service_types = await AppDataSourceSqlite.manager.save([
        service_type_1,
        service_type_2,
      ]);
      console.log('Service types created');

      // SERVICE ORDERS
      await AppDataSourceSqlite.manager.save(
        fn_service_offer_1({
          service_type_fk: service_types[0].service_type_id,
          user_fk: user2.user_id,
        }),
      );
      console.log('Service offers created');
    }

    process.exit();
  })
  .catch((error) => console.log(error));
// };
