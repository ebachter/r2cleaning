import drizzle, {
  object,
  objectType,
  order,
  requestService,
  serviceOffer,
  serviceType,
} from '@remrob/drizzle';
import {and, eq, inArray} from 'drizzle-orm';
import typia from 'typia';
import {protectedProcedure, publicProcedure, router} from '../middleware';

type ObjectType = typeof object.$inferSelect;
type OrderType = typeof order.$inferSelect;
type ServiceOfferType = typeof serviceOffer.$inferSelect;

export const intRouter = router({
  createOrder: protectedProcedure
    .input(
      // typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
      typia.createAssert<{
        object_id: ObjectType['id'];
        serviceTypeId: number;
        date: Date;
      }>(),
    )
    .output(typia.createAssert<{newOrderId: number}>())
    .mutation(async ({ctx, input}) => {
      // console.log('--ctx--', ctx.session);
      const userId = ctx.session?.userid;
      // const {objectType} = input;

      const newOrder: Omit<OrderType, 'id'> = {
        objectId: input.object_id,
        userId: userId,
        date: input.date,
      };

      const insertId = await drizzle.transaction(async (tx) => {
        const temp = await tx.insert(order).values(newOrder as OrderType);

        await tx.insert(requestService).values({
          orderId: temp[0].insertId,
          serviceTypeId: input.serviceTypeId,
          userId,
        });
        return temp[0].insertId;
      });

      return {newOrderId: insertId};
    }),

  loadOrders: protectedProcedure.query(async ({ctx}) => {
    const data = await drizzle.query.order.findMany({
      with: {object: {with: {objectType: true}}},
      where: eq(order.userId, ctx.session.userId),
    });

    return data;
  }),

  loadObjectTypes: protectedProcedure.query(async ({ctx}) => {
    const data = await drizzle.select().from(objectType);

    return data;
  }),

  loadRequestsForSupplier: protectedProcedure.query(async ({ctx}) => {
    const subQuery = drizzle
      .select({
        data: serviceOffer.serviceTypeId,
      })
      .from(serviceOffer)
      .where(eq(serviceOffer.userId, ctx.session.userId));
    //.as('subQuery');

    const result = await drizzle
      .select()
      .from(order)
      .innerJoin(requestService, eq(order.id, requestService.orderId))
      .innerJoin(object, eq(object.id, order.objectId))
      .where(inArray(requestService.serviceTypeId, subQuery));

    return result;
  }),

  loadRequestForSupplier: protectedProcedure
    .input(typia.createAssert<{requestId: number}>())
    .query(async ({ctx, input}) => {
      const subQuery = drizzle
        .select({
          data: serviceOffer.serviceTypeId,
        })
        .from(serviceOffer)
        .where(eq(serviceOffer.userId, ctx.session.userId));
      //.as('subQuery');

      const result = await drizzle
        .select()
        .from(order)
        .innerJoin(requestService, eq(order.id, requestService.orderId))
        .innerJoin(object, eq(object.id, order.objectId))
        .innerJoin(objectType, eq(object.type, objectType.id))
        .where(
          and(
            inArray(requestService.serviceTypeId, subQuery),
            eq(order.id, input.requestId),
          ),
        )
        .limit(1);

      return result[0];
    }),

  loadObjects: protectedProcedure.query(async ({ctx}) => {
    const userId = ctx.session?.userid;
    // const data = await AppDataSourceSqlite.getRepository(EntityObject).find();
    const data = await drizzle.query.object.findMany({
      columns: {userId: false},
      with: {objectType: true},
      where: eq(object.userId, userId),
    });
    return data;
  }),

  loadServiceTypes: protectedProcedure.query(async ({ctx}) => {
    const data = await drizzle.query.serviceType.findMany({
      columns: {id: true, name: true},
    });
    return data;
  }),

  loadServiceOffers: protectedProcedure.query(async ({ctx}) => {
    const userId = ctx.session.userId;

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

    return res;
  }),

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

      if (value === true) {
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
        .where(eq(order.userId, ctx.session.userId));
      console.log('--temp--', data);

      return data[0];
    }),

  onChannel: publicProcedure
    .input(typia.createAssert<{}>())
    .subscription(async function* () {
      for (let i = 0; i < 3; i++) {
        yield `foo:${Date.now()}`;
      }
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
        with: {objectType: true},
        where: eq(object.id, input.objectId),
      });

      // console.log('--temp--', data);

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
