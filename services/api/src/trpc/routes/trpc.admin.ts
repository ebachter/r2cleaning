import drizzle, {city} from '@remrob/drizzle';
import {adminProcedure, router} from '../middleware';
import typia from 'typia';
import {eq} from 'drizzle-orm';

type CityType = typeof city.$inferSelect;

export const adminRouter = router({
  addLocation: adminProcedure
    .input(typia.createAssert<Pick<CityType, 'nameEn' | 'nameDe' | 'nameRu'>>())
    .mutation(async ({ctx, input}) => {
      await drizzle.insert(city).values({...input, userId: ctx.session.userId});
    }),

  deleteLocation: adminProcedure
    .input(typia.createAssert<{cityId: number}>())
    .mutation(async ({ctx, input}) => {
      await drizzle.delete(city).where(eq(city.id, input.cityId));
    }),
});
