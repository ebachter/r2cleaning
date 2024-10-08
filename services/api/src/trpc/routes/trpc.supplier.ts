import drizzle, {
  object,
  objectType,
  offer,
  order,
  requests,
  requestService,
  serviceOffer,
} from '@remrob/drizzle';
import {protectedProcedure, router} from '../middleware';
import {and, eq, inArray} from 'drizzle-orm';
import typia from 'typia';

type OfferType = typeof offer.$inferSelect;
type PriceType = string;

export const supplierRouter = router({
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

  offer: {
    create: protectedProcedure
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

    cancel: protectedProcedure
      .input(typia.createAssert<{offerId: OfferType['id']}>())
      .mutation(async ({ctx, input}) => {
        const userId = ctx.session?.userid;

        await drizzle
          .delete(offer)
          .where(and(eq(offer.id, input.offerId), eq(offer.userId, userId)));
      }),
  },
});
