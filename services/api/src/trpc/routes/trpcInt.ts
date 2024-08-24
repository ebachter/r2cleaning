import drizzle, {
  object,
  order,
  serviceOffer,
  serviceType,
  user,
} from '@remrob/drizzle';
import typia from 'typia';
import {protectedProcedure, router} from '../middleware';
import {and, eq, SQL} from 'drizzle-orm';

/* type SessionReturn = {
  sessionToken?: string;
  refreshToken?: string;
  error?: {status: 401 | 500};
}; */

type ObjectType = typeof object.$inferSelect;
type OrderType = typeof order.$inferSelect;
type ServiceOfferType = typeof serviceOffer.$inferSelect;

export const intRouter = router({
  createOrder: protectedProcedure
    .input(
      // typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
      typia.createAssert<
        {object_id: ObjectType['id']} & Pick<OrderType, 'price'>
      >(),
    )
    .output(typia.createAssert<{newOrderId: number}>())
    .mutation(async ({ctx, input}) => {
      // console.log('--ctx--', ctx.session);
      const userId = ctx.session?.userid;
      // const {objectType} = input;

      const newOrder: Pick<OrderType, 'objectId' | 'customerId' | 'price'> = {
        objectId: input.object_id,
        customerId: userId,
        price: String(input.price),
      };
      /* const order =
        AppDataSourceSqlite.getRepository(EntityOrder).create(newOrder);
      // console.log('tableName', data);
      const temp = await AppDataSourceSqlite.manager.save(order); */

      const temp = await drizzle.insert(order).values(newOrder as OrderType);

      return {newOrderId: temp[0].insertId};
    }),

  loadOrders: protectedProcedure.query(async ({ctx}) => {
    const data = await drizzle.query.order.findMany({
      with: {object: true},
      where: eq(order.customerId, ctx.session.userId),
    });

    return data;
  }),

  loadObjects: protectedProcedure.query(async ({ctx}) => {
    const userId = ctx.session?.userid;
    // const data = await AppDataSourceSqlite.getRepository(EntityObject).find();
    const data = await drizzle.query.object.findMany({
      where: eq(object.userId, userId),
    });
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

  loadServiceTypes: protectedProcedure.query(async ({ctx}) => {
    /* const data = await AppDataSourceSqlite.getRepository(
      EntityServiceTypes,
    ).find({
      select: {service_type_id: true, serviceName: {}},
    }); */
    const data = await drizzle.query.serviceType.findMany({
      columns: {id: true, name: true},
    });
    return data;
  }),

  loadServiceOffers: protectedProcedure.query(async ({ctx}) => {
    const userId = ctx.session.userId;

    /* const sTypes = await AppDataSourceSqlite.getRepository(EntityServiceTypes)
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
    const res = await sTypes.getMany(); */

    const res = await drizzle
      .select()
      .from(serviceType)
      .leftJoin(
        serviceOffer,
        and(
          eq(serviceType.id, serviceOffer.serviceTypeId),
          eq(serviceOffer.userId, userId),
        ),
      );

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

      /* const service_type = new EntityServiceTypes();
      service_type.service_type_id = service_type_id;

      const user = new EntityUser();
      user.user_id = userId;
      console.log({
        service_type: {service_type_id: service_type_id},
        user: {user_id: userId},
        value,
      }); */
      if (value === true) {
        /* const newOrder: Omit<EntityServiceOffers, 'service_offer_id'> = {
          service_type,
          user,
          price: null,
        }; */
        /* const order =
          AppDataSourceSqlite.getRepository(EntityServiceOffers).create(
            newOrder,
          ); */
        // await AppDataSourceSqlite.manager.save(order);

        const newOrder: Omit<ServiceOfferType, 'id'> = {
          userId,
          price: null,
          serviceTypeId: service_type_id,
        };

        await drizzle.insert(serviceOffer).values(newOrder as ServiceOfferType);
      } else {
        await drizzle
          .delete(serviceOffer)
          .where(
            and(
              eq(serviceOffer.serviceTypeId, service_type_id),
              eq(serviceOffer.userId, userId),
            ),
          );

        /* await AppDataSourceSqlite.manager
          .getRepository(EntityServiceOffers)
          .delete({
            service_type: {service_type_id: service_type_id},
            user: {user_id: userId},
          }); */
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

  loadOrder: protectedProcedure
    .input(typia.createAssert<{orderId: number}>())
    // .output(typia.createAssert<{newOrderId: number}>())
    .query(async ({ctx, input}) => {
      console.log('>>>', input.orderId);
      /* const data = await AppDataSourceSqlite.getRepository(
        EntityOrder,
      ).findOneByOrFail({order_id: input.orderId}); */

      const data = await drizzle
        .select()
        .from(order)
        .where(eq(order.customerId, ctx.session.userId));
      console.log('--temp--', data);

      return data[0];
    }),

  loadObject: protectedProcedure
    .input(typia.createAssert<{objectId: number}>())
    // .output(typia.createAssert<{newOrderId: number}>())
    .query(async ({ctx, input}) => {
      console.log('>>>', input.objectId);
      /* const data = await AppDataSourceSqlite.getRepository(
        EntityObject,
      ).findOneByOrFail({object_id: input.objectId});
      console.log('--obj--', data); */

      const data = await drizzle.query.object.findFirst({
        where: eq(order.objectId, input.objectId),
      });

      console.log('--temp--', data);

      return data;
    }),

  addObject: protectedProcedure
    .input(typia.createAssert<Omit<ObjectType, 'id' | 'userId'>>())
    .output(typia.createAssert<{newObjectId: number}>())
    .mutation(async ({ctx, input}) => {
      // console.log('--ctx--', ctx.session);
      const userId = ctx.session?.userid;
      // const {object_type} = input;

      const newObject = {
        ...input,
        userId,
      } as ObjectType;
      // const order = new Order();
      // order.objectType = newOrder.objectType; // as TypeOrder['objectType'];
      // order.user_fk = newOrder.user_fk;

      // const data = AppDataSourceSqlite.getRepository(Order).metadata.columns;
      /* const order =
        AppDataSourceSqlite.getRepository(EntityObject).create(newObject);
      console.log('tableName', order); */

      // const temp = await AppDataSourceSqlite.manager.save(order);

      const temp = await drizzle.insert(object).values(newObject);

      return {newObjectId: temp[0].insertId};
    }),
});
