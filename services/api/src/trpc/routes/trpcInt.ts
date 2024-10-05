import drizzle, {
  object,
  objectType,
  offer,
  order,
  requests,
  requestService,
  serviceOffer,
  serviceType,
  user,
} from '@remrob/drizzle';
import {and, count, eq, getTableColumns, inArray} from 'drizzle-orm';
import typia, {tags} from 'typia';
import {protectedProcedure, publicProcedure, router} from '../middleware';
import {TRPCError} from '@trpc/server';

type ObjectType = typeof object.$inferSelect;
type RequestType = typeof requests.$inferSelect;
type ServiceOfferType = typeof serviceOffer.$inferSelect;
type OfferType = typeof offer.$inferSelect;
type OrderType = typeof order.$inferSelect;

type PriceType = string /* &
  tags.Minimum<500> &
  tags.Maximum<500000> &
  tags.Pattern<'^d*.?d*$'> */;

export const intRouter = router({
  createRequest: protectedProcedure
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

      const insertId = await drizzle.transaction(async (tx) => {
        const temp = await tx.insert(requests).values({
          objectId: input.object_id,
          userId: userId,
          cleaningDate: input.date,
        });

        await tx.insert(requestService).values({
          requestId: temp[0].insertId,
          serviceTypeId: input.serviceTypeId,
          userId,
        });
        return temp[0].insertId;
      });

      return {newOrderId: insertId};
    }),

  loadOrders: protectedProcedure.query(async ({ctx}) => {
    const offerCount = drizzle
      .select({count: count().as('numberOfOffers'), requestId: offer.requestId})
      .from(offer)
      .groupBy(offer.requestId)
      .as('offerCount');

    console.log(offerCount);

    const data = await drizzle
      .select()
      .from(requests)
      .innerJoin(object, eq(object.id, requests.objectId))
      .innerJoin(objectType, eq(objectType.id, object.type))
      .leftJoin(order, eq(order.requestId, requests.id))
      .leftJoin(offerCount, eq(offerCount.requestId, requests.id))
      .where(eq(requests.userId, ctx.session.userId));

    return data;
  }),

  loadOrdersOfSupplier: protectedProcedure.query(async ({ctx}) => {
    const data = await drizzle
      .select()
      .from(requests)
      .innerJoin(object, eq(object.id, requests.objectId))
      .innerJoin(objectType, eq(objectType.id, object.type))
      .leftJoin(order, eq(order.requestId, requests.id))
      .innerJoin(offer, eq(offer.requestId, requests.id))
      .where(eq(offer.userId, ctx.session.userId));

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
      .from(requests)
      .innerJoin(requestService, eq(requests.id, requestService.requestId))
      .innerJoin(object, eq(object.id, requests.objectId))
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

      const result = await drizzle
        .select()
        .from(requests)
        .innerJoin(requestService, eq(requests.id, requestService.requestId))
        .innerJoin(object, eq(object.id, requests.objectId))
        .leftJoin(offer, eq(offer.requestId, requests.id))
        .innerJoin(objectType, eq(object.type, objectType.id))
        .where(
          and(
            inArray(requestService.serviceTypeId, subQuery),
            eq(requests.id, input.requestId),
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
      with: {objectType: true, city: true},
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

  createServiceOffer: protectedProcedure
    .input(
      // typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
      typia.createAssert<{
        service_type_id: number;
      }>(),
    )
    .mutation(async ({ctx, input}) => {
      // console.log('--ctx--', ctx.session);
      const userId = ctx.session?.userid;
      const {service_type_id} = input;

      const newOrder: Omit<ServiceOfferType, 'id'> = {
        userId,
        serviceTypeId: service_type_id,
      };

      await drizzle.insert(serviceOffer).values(newOrder as ServiceOfferType);
    }),

  deleteServiceOffer: protectedProcedure
    .input(
      // typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
      typia.createAssert<{
        service_type_id: number;
      }>(),
    )
    .mutation(async ({ctx, input}) => {
      // console.log('--ctx--', ctx.session);
      const userId = ctx.session?.userid;
      const {service_type_id} = input;

      await drizzle
        .delete(serviceOffer)
        .where(
          and(
            eq(serviceOffer.serviceTypeId, service_type_id),
            eq(serviceOffer.userId, userId),
          ),
        );
    }),

  loadOrder: protectedProcedure
    .input(typia.createAssert<{orderId: number}>())
    .query(async ({ctx, input}) => {
      const data = await drizzle
        .select()
        .from(requests)
        .innerJoin(objectType, eq(requests.objectId, objectType.id))
        .leftJoin(offer, eq(requests.objectId, objectType.id))
        .where(
          and(
            eq(requests.userId, ctx.session.userId),
            eq(requests.id, input.orderId),
          ),
        );

      const offers = await drizzle
        .select({
          offer: {...getTableColumns(offer)},
          user: {...getTableColumns(user)},
        })
        .from(offer)
        .innerJoin(requests, eq(offer.requestId, requests.id))
        .innerJoin(user, eq(offer.userId, user.id))
        .where(
          and(
            eq(offer.userId, ctx.session.userId),
            eq(offer.requestId, input.orderId),
          ),
        );

      return {req: data[0], offers};
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

      const data = await drizzle.query.object.findFirst({
        with: {objectType: true},
        where: eq(object.id, input.objectId),
      });

      return data;
    }),

  addObject: protectedProcedure
    .input(typia.createAssert<Omit<ObjectType, 'id' | 'userId'>>())
    .output(typia.createAssert<{newObjectId: number}>())
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;

      const newObject = {
        ...input,
        userId,
      } as ObjectType;

      const temp = await drizzle.insert(object).values(newObject);

      return {newObjectId: temp[0].insertId};
    }),

  createOffer: protectedProcedure
    .input(
      typia.createAssert<
        Pick<OfferType, 'requestId' | 'cleaningTime'> & {price: PriceType}
      >(),
    )
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;

      const temp = await drizzle.insert(offer).values({
        userId,
        requestId: input.requestId,
        cleaningTime: input.cleaningTime,
        price: input.price,
      });

      return {newObjectId: temp[0].insertId};
    }),

  cancelOffer: protectedProcedure
    .input(typia.createAssert<{offerId: OfferType['id']}>())
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;

      await drizzle
        .delete(offer)
        .where(and(eq(offer.id, input.offerId), eq(offer.userId, userId)));
    }),

  acceptOffer: protectedProcedure
    .input(typia.createAssert<Pick<OrderType, 'offerId'>>())
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;

      // TO REPLACE WITH SINGLE QUERY AFTER FEATURE IS AVAILABLE
      const data = await drizzle.query.offer.findFirst({
        with: {request: true},
        where: and(eq(offer.id, input.offerId), eq(requests.userId, userId)),
      });

      console.log('>>>', data);

      if (!data)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Offer was not found.',
          // optional: pass the original error to retain stack trace
          // cause: theError,
        });

      const temp = await drizzle.insert(order).values({
        objectId: data.request.objectId,
        requestId: data.requestId,
        offerId: input.offerId,
        cleaningDate: data.request.cleaningDate,
        cleaningTime: data.cleaningTime,
        price: data.price,
      });

      return {newObjectId: temp[0].insertId};
    }),
});
