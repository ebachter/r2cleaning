import drizzle, {city, objectType} from '@remrob/drizzle';
import {protectedProcedure, router} from '../middleware';

export const masterdataRouter = router({
  loadObjectTypes: protectedProcedure.query(async ({ctx}) => {
    const data = await drizzle.select().from(objectType);
    return data;
  }),

  loadCities: protectedProcedure.query(async ({ctx}) => {
    const data = await drizzle.select().from(city);
    return data;
  }),

  loadServiceTypes: protectedProcedure.query(async ({ctx}) => {
    const data = await drizzle.query.service.findMany({
      columns: {id: true, name: true},
    });
    return data;
  }),
});
