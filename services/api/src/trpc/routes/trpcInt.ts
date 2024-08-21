import AppDataSourceSqlite, {
  EntityObject,
  EntityOrder,
  EntityServiceOffers,
  EntityServiceTypes,
  EntityUser,
} from '@remrob/db';
import drizzle from '@remrob/drizzle';
import {TypeOrder} from '@remrob/mysql';
import typia from 'typia';
import {protectedProcedure, publicProcedure, router} from '../middleware';

/* type SessionReturn = {
  sessionToken?: string;
  refreshToken?: string;
  error?: {status: 401 | 500};
}; */

export const intRouter = router({
  createOrder: protectedProcedure
    .input(
      // typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
      typia.createAssert<
        {object_id: EntityObject['object_id']} & Pick<TypeOrder, 'price'>
      >(),
    )
    .output(typia.createAssert<{newOrderId: number}>())
    .mutation(async ({ctx, input}) => {
      // console.log('--ctx--', ctx.session);
      const userId = ctx.session?.userid;
      // const {objectType} = input;

      const newOrder: Pick<EntityOrder, 'object_fk' | 'user_fk' | 'price'> = {
        object_fk: input.object_id,
        user_fk: userId,
        price: input.price,
      };
      // const order = new Order();
      // order.objectType = newOrder.objectType; // as TypeOrder['objectType'];
      // order.user_fk = newOrder.user_fk;

      // const data = AppDataSourceSqlite.getRepository(Order).metadata.columns;
      const order =
        AppDataSourceSqlite.getRepository(EntityOrder).create(newOrder);
      // console.log('tableName', data);

      const temp = await AppDataSourceSqlite.manager.save(order);
      return {newOrderId: temp.order_id};
    }),

  loadOrders: publicProcedure.query(async ({ctx}) => {
    const data = await drizzle.query.order.findMany({with: {object: true}});

    return data;
  }),

  loadObjects: publicProcedure.query(async ({ctx}) => {
    const data = await AppDataSourceSqlite.getRepository(EntityObject).find();

    return data;
  }),

  /* loadServiceTypes2: publicProcedure.query(async ({ctx}) => {
    const data = await AppDataSourceSqlite.getRepository(
      EntityServiceTypes,
    ).find({
      select: {service_type_id: true, serviceName: {}},
      join: {
        alias: 'service_offers',
        leftJoin: {
          service_offers: 'service_offers.service_type',
        },
      },
    });
    return data;
  }), */

  loadServiceTypes: publicProcedure.query(async ({ctx}) => {
    const data = await AppDataSourceSqlite.getRepository(
      EntityServiceTypes,
    ).find({
      select: {service_type_id: true, serviceName: {}},
    });
    return data;
  }),

  loadServiceOffers: publicProcedure.query(async ({ctx}) => {
    const userId = ctx.session?.userid;

    const sTypes = await AppDataSourceSqlite.getRepository(EntityServiceTypes)
      .createQueryBuilder('serviceTypes')
      .leftJoinAndMapOne(
        'serviceTypes.service_type',
        EntityServiceOffers,
        'offer',
        'offer.serviceTypeServiceTypeId = serviceTypes.service_type_id AND offer.userUserId = :isRemoved',
        {isRemoved: userId},
      )
      .select([
        'serviceTypes.service_type_id',
        'serviceTypes.serviceName',
        'offer.service_offer_id',
        'offer.price',
      ]);
    //.where('serviceTypes.service_type_id = :id', {id: 4})
    // console.log('>>>', sTypes.getSql());
    const res = await sTypes.getMany();
    // console.log('+++', res);
    return res;
  }),
  /* loadServiceTypes2: publicProcedure.query(async ({ctx}) => {
    const userId = ctx.session?.userid;

    const data = await AppDataSourceSqlite.getRepository(
      EntityServiceTypes,
    ).find({
      select: {
        service_type_id: true,
        serviceName: {},
        service_type: {service_offer_id: true, price: true},
      },
      where: {service_type: {user: {user_id: userId}}},
      relations: {service_type: true},
    });
    return data;
  }), */

  setServiceOffer: protectedProcedure
    .input(
      // typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
      typia.createAssert<{
        service_type_id: number;
        value: boolean;
      }>(),
    )
    .mutation(async ({ctx, input}) => {
      // console.log('--ctx--', ctx.session);
      const userId = ctx.session?.userid;
      const {service_type_id, value} = input;

      const service_type = new EntityServiceTypes();
      service_type.service_type_id = service_type_id;

      const user = new EntityUser();
      user.user_id = userId;
      console.log({
        service_type: {service_type_id: service_type_id},
        user: {user_id: userId},
        value,
      });
      if (value === true) {
        const newOrder: Omit<EntityServiceOffers, 'service_offer_id'> = {
          service_type,
          user,
          price: null,
        };
        const order =
          AppDataSourceSqlite.getRepository(EntityServiceOffers).create(
            newOrder,
          );
        await AppDataSourceSqlite.manager.save(order);
      } else {
        await AppDataSourceSqlite.manager
          .getRepository(EntityServiceOffers)
          .delete({
            service_type: {service_type_id: service_type_id},
            user: {user_id: userId},
          });
      }
    }),

  /* loadServiceOffers: publicProcedure.query(async ({ctx}) => {
    const data = await AppDataSourceSqlite.getRepository(
      EntityServiceOffers,
    ).find({
      select: {
        service_offer_id: true,
        price: true,
        user: {firstName: true, lastName: true},
        service_type: {serviceName: {}},
      },
      relations: {user: true, service_type: true},
    });
    console.log('EntityServiceOffers', data);
    return data;
  }), */

  loadOrder: publicProcedure
    .input(typia.createAssert<{orderId: number}>())
    // .output(typia.createAssert<{newOrderId: number}>())
    .query(async ({ctx, input}) => {
      console.log('>>>', input.orderId);
      const data = await AppDataSourceSqlite.getRepository(
        EntityOrder,
      ).findOneByOrFail({order_id: input.orderId});
      console.log('--temp--', data);

      return data as EntityOrder & Pick<EntityObject, 'object_type'>;
    }),

  loadObject: publicProcedure
    .input(typia.createAssert<{objectId: number}>())
    // .output(typia.createAssert<{newOrderId: number}>())
    .query(async ({ctx, input}) => {
      console.log('>>>', input.objectId);
      const data = await AppDataSourceSqlite.getRepository(
        EntityObject,
      ).findOneByOrFail({object_id: input.objectId});
      console.log('--obj--', data);

      return data as EntityObject & Pick<EntityObject, 'object_type'>;
    }),

  addObject: protectedProcedure
    .input(
      typia.createAssert<
        Omit<EntityObject, 'object_id' | 'data' | 'user_fk'>
      >(),
    )
    .output(typia.createAssert<{newObjectId: number}>())
    .mutation(async ({ctx, input}) => {
      // console.log('--ctx--', ctx.session);
      const userId = ctx.session?.userid;
      const {object_type} = input;

      const newObject = {
        ...input,
        user_fk: userId,
      };
      // const order = new Order();
      // order.objectType = newOrder.objectType; // as TypeOrder['objectType'];
      // order.user_fk = newOrder.user_fk;

      // const data = AppDataSourceSqlite.getRepository(Order).metadata.columns;
      const order =
        AppDataSourceSqlite.getRepository(EntityObject).create(newObject);
      console.log('tableName', order);

      const temp = await AppDataSourceSqlite.manager.save(order);
      return {newObjectId: temp.object_id};
    }),
});
