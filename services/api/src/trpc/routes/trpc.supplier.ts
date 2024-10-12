import drizzle, {
  city,
  object,
  objectType,
  offer,
  order,
  requests,
  requestService,
  service,
  supplierCity,
  supplierService,
} from '@remrob/drizzle';
import {protectedProcedure, router} from '../middleware';
import {and, eq, inArray} from 'drizzle-orm';
import typia from 'typia';

type OfferType = typeof offer.$inferSelect;
type PriceType = string;
type ServiceOfferType = typeof supplierService.$inferSelect;

export const supplierRouter = router({
  cities: {
    get: protectedProcedure.query(async ({ctx}) => {
      const data = await drizzle
        .select()
        .from(city)
        .leftJoin(
          supplierCity,
          and(
            eq(city.id, supplierCity.cityId),
            eq(supplierCity.userId, ctx.session.userId),
          ),
        );
      return data;
    }),
    add: protectedProcedure
      .input(
        // typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
        typia.createAssert<{
          cityId: number;
        }>(),
      )
      .mutation(async ({ctx, input}) => {
        const data = await drizzle.insert(supplierCity).values({
          cityId: input.cityId,
          userId: ctx.session.userId,
        });
        return data;
      }),
    remove: protectedProcedure
      .input(
        // typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
        typia.createAssert<{
          cityId: number;
        }>(),
      )
      .mutation(async ({ctx, input}) => {
        const data = await drizzle
          .delete(supplierCity)
          .where(
            and(
              eq(supplierCity.cityId, input.cityId),
              eq(supplierCity.userId, ctx.session.userId),
            ),
          );
        return data;
      }),
  },

  request: {
    get: {
      all: protectedProcedure.query(async ({ctx}) => {
        const subQueryServices = drizzle
          .select({
            data: supplierService.serviceId,
          })
          .from(supplierService)
          .where(eq(supplierService.userId, ctx.session.userId));
        //.as('subQuery');

        const subQueryCities = drizzle
          .select({
            data: supplierCity.cityId,
          })
          .from(supplierCity)
          .where(eq(supplierCity.userId, ctx.session.userId));
        //.as('subQuery');

        const result = await drizzle
          .select()
          .from(requests)
          .innerJoin(requestService, eq(requests.id, requestService.requestId))
          .innerJoin(object, eq(object.id, requests.objectId))
          .innerJoin(objectType, eq(objectType.id, object.type))
          // .where(inArray(requestService.serviceId, subQueryServices));
          .where(
            and(
              inArray(requestService.serviceId, subQueryServices),
              inArray(object.addressCity, subQueryCities),
            ),
          );

        return result;
      }),
    },
  },

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

  /* loadRequestsForSupplier: protectedProcedure.query(async ({ctx}) => {
    const subQuery = drizzle
      .select({
        data: supplierService.serviceId,
      })
      .from(supplierService)
      .where(eq(supplierService.userId, ctx.session.userId));
    //.as('subQuery');

    const result = await drizzle
      .select()
      .from(requests)
      .innerJoin(requestService, eq(requests.id, requestService.requestId))
      .innerJoin(object, eq(object.id, requests.objectId))
      .where(inArray(requestService.serviceId, subQuery));

    return result;
  }), */

  loadRequestForSupplier: protectedProcedure
    .input(typia.createAssert<{requestId: number}>())
    .query(async ({ctx, input}) => {
      const subQuery = drizzle
        .select({
          data: supplierService.serviceId,
        })
        .from(supplierService)
        .where(eq(supplierService.userId, ctx.session.userId));

      const result = await drizzle
        .select()
        .from(requests)
        .innerJoin(requestService, eq(requests.id, requestService.requestId))
        .innerJoin(object, eq(object.id, requests.objectId))
        .leftJoin(offer, eq(offer.requestId, requests.id))
        .innerJoin(objectType, eq(object.type, objectType.id))
        .where(
          and(
            inArray(requestService.serviceId, subQuery),
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
          Pick<OfferType, 'requestId' | 'cleaningDate' | 'cleaningTime'> & {
            price: PriceType;
          }
        >(),
      )
      .mutation(async ({ctx, input}) => {
        const userId = ctx.session?.userid;

        const temp = await drizzle.insert(offer).values({
          userId,
          requestId: input.requestId,
          cleaningDate: input.cleaningDate,
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

  service: {
    get: {
      all: protectedProcedure.query(async ({ctx}) => {
        const userId = ctx.session.userId;

        const res = await drizzle
          .select()
          .from(service)
          .leftJoin(
            supplierService,
            and(
              eq(service.id, supplierService.serviceId),
              eq(supplierService.userId, userId),
            ),
          );

        return res;
      }),
    },

    add: protectedProcedure
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
          serviceId: service_type_id,
        };

        await drizzle
          .insert(supplierService)
          .values(newOrder as ServiceOfferType);
      }),

    delete: protectedProcedure
      .input(
        // typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
        typia.createAssert<{
          service_id: number;
        }>(),
      )
      .mutation(async ({ctx, input}) => {
        // console.log('--ctx--', ctx.session);
        const userId = ctx.session?.userid;
        const {service_id} = input;

        await drizzle
          .delete(supplierService)
          .where(
            and(
              eq(supplierService.serviceId, service_id),
              eq(supplierService.userId, userId),
            ),
          );
      }),
  },
});
