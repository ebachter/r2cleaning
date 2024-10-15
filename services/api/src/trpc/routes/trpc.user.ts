import drizzle, {
  city,
  object,
  objectType,
  offer,
  order,
  requests,
  requestService,
  user,
} from '@remrob/drizzle';
import {and, count, eq, getTableColumns, isNull, ne, sql} from 'drizzle-orm';
import typia from 'typia';
import {protectedProcedure, router} from '../middleware';
import {TRPCError} from '@trpc/server';

type ObjectType = typeof object.$inferSelect;
type OrderType = typeof order.$inferSelect;

export const intRouter = router({
  orders: {
    get: {
      all: protectedProcedure.query(async ({ctx}) => {
        const offerCount = drizzle
          .select({
            count: count().as('numberOfOffers'),
            requestId: offer.requestId,
          })
          .from(offer)
          .where(isNull(offer.cancelledAt))
          .groupBy(offer.requestId)
          .as('offerCount');

        const data = await drizzle
          .select()
          .from(requests)
          .innerJoin(object, eq(object.id, requests.objectId))
          .innerJoin(city, eq(city.id, object.addressCity))
          .innerJoin(objectType, eq(objectType.id, object.type))
          .leftJoin(order, eq(order.requestId, requests.id))
          .leftJoin(offerCount, eq(offerCount.requestId, requests.id))
          .where(eq(requests.userId, ctx.session.userId));

        return data;
      }),

      one: protectedProcedure
        .input(typia.createAssert<{orderId: number}>())
        .query(async ({ctx, input}) => {
          const data = await drizzle
            .select()
            .from(requests)
            .innerJoin(objectType, eq(requests.objectId, objectType.id))
            .innerJoin(object, eq(object.id, requests.objectId))
            .innerJoin(city, eq(city.id, object.addressCity))
            .leftJoin(offer, eq(requests.objectId, objectType.id))
            .leftJoin(order, eq(order.requestId, requests.id))
            .innerJoin(user, eq(offer.userId, user.id))
            .where(
              and(
                eq(requests.userId, ctx.session.userId),
                eq(requests.id, input.orderId),
                isNull(offer.cancelledAt),
              ),
            );

          const offers = await drizzle
            .select({
              offer: {...getTableColumns(offer)},
              user: {...getTableColumns(user)},
              order: {id: order.id},
            })
            .from(offer)
            .innerJoin(requests, eq(offer.requestId, requests.id))
            .innerJoin(user, eq(offer.userId, user.id))
            .leftJoin(order, eq(order.offerId, offer.id))
            .where(
              and(
                eq(requests.userId, ctx.session.userId),
                eq(offer.requestId, input.orderId),
                isNull(offer.cancelledAt),
              ),
            );

          return {req: data[0], offers};
        }),
    },

    accept: protectedProcedure
      .input(typia.createAssert<Pick<OrderType, 'offerId'>>())
      .mutation(async ({ctx, input}) => {
        const userId = ctx.session?.userId;

        // TO REPLACE WITH SINGLE QUERY AFTER FEATURE IS AVAILABLE
        /* const data = await drizzle.query.offer.findFirst({
          with: {request: true},
          where: and(eq(offer.id, input.offerId), eq(requests.userId, userId)),
        });  */

        const offerData = await drizzle
          .select()
          .from(offer)
          .innerJoin(requests, eq(requests.id, offer.requestId))
          .where(and(eq(offer.id, input.offerId), eq(requests.userId, userId)));

        const data = offerData[0];

        if (!data)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Offer was not found.',
            // optional: pass the original error to retain stack trace
            // cause: theError,
          });

        const txRes = await drizzle.transaction(async (tx) => {
          const temp = await tx.insert(order).values({
            requestId: data.offers.requestId,
            offerId: input.offerId,
          });

          await tx
            .update(offer)
            .set({cancelledAt: sql`now()`})
            .where(
              and(
                eq(offer.requestId, data.offers.requestId),
                ne(offer.id, input.offerId),
              ),
            );

          return {newObjectId: temp[0].insertId};
        });

        return {newObjectId: txRes};
      }),

    create: protectedProcedure
      .input(
        // typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
        typia.createAssert<{
          object_id: ObjectType['id'];
          serviceId: number;
          date: string;
        }>(),
      )
      .output(
        typia.createAssert<{status: 'success' | 'error'; newOrderId: number}>(),
      )
      .mutation(async ({ctx, input}) => {
        // console.log('--ctx--', ctx.session);
        const userId = ctx.session?.userId;
        // const {objectType} = input;

        const insertId = await drizzle.transaction(async (tx) => {
          const temp = await tx.insert(requests).values({
            objectId: input.object_id,
            userId: userId,
            cleaningDate: input.date,
          });

          await tx.insert(requestService).values({
            requestId: temp[0].insertId,
            serviceId: input.serviceId,
            userId,
          });
          return temp[0].insertId;
        });

        return {status: 'success', newOrderId: insertId};
      }),
  },

  objects: {
    get: {
      all: protectedProcedure.query(async ({ctx}) => {
        const userId = ctx.session?.userId;
        // const data = await AppDataSourceSqlite.getRepository(EntityObject).find();
        const data = await drizzle.query.object.findMany({
          columns: {userId: false},
          with: {objectType: true, city: true},
          where: eq(object.userId, userId),
        });
        return data;
      }),

      one: protectedProcedure
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
    },

    add: protectedProcedure
      .input(typia.createAssert<Omit<ObjectType, 'id' | 'userId'>>())
      .output(typia.createAssert<{newObjectId: number}>())
      .mutation(async ({ctx, input}) => {
        const userId = ctx.session?.userId;

        const newObject = {
          ...input,
          userId,
        } as ObjectType;

        const temp = await drizzle.insert(object).values(newObject);

        return {newObjectId: temp[0].insertId};
      }),
  },
});
