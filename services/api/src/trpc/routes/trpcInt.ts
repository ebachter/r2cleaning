import {TypeOrder} from '@remrob/mysql';
import {router, publicProcedure, protectedProcedure} from '../middleware';
import AppDataSourceSqlite from '@remrob/db';
import {EntityOrder, EntityObject} from '@remrob/db';
import typia from 'typia';

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
      /* z.object({
        objectType: z.enum(['flat', 'house', 'floor']),
      }), */
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
    const data = await AppDataSourceSqlite.getRepository(EntityOrder).find();
    console.log('--temp--', data);

    return data as (EntityOrder & Pick<EntityObject, 'object_type'>)[];
  }),

  loadObjects: publicProcedure.query(async ({ctx}) => {
    const data = await AppDataSourceSqlite.getRepository(EntityObject).find();
    console.log('--temp--', data);

    return data;
  }),

  loadOrder: publicProcedure
    .input(
      typia.createAssert<{orderId: number}>(),
      /* z.object({
      objectType: z.enum(['flat', 'house', 'floor']),
    }), */
    )
    // .output(typia.createAssert<{newOrderId: number}>())
    .query(async ({ctx, input}) => {
      console.log('>>>', input.orderId);
      const data = await AppDataSourceSqlite.getRepository(
        EntityOrder,
      ).findOneByOrFail({order_id: input.orderId});
      console.log('--temp--', data);

      /* const data2 = await AppDataSourceSqlite.getRepository(
        Order,
      ).find({
        relations: {"object_fk":true},
        select:{
          
        }
      }); */
      console.log('--temp--', data);

      return data as EntityOrder & Pick<EntityObject, 'object_type'>;
    }),

  addObject: protectedProcedure
    .input(
      typia.createAssert<
        Omit<EntityObject, 'object_id' | 'data' | 'user_fk'>
      >(),
      /* z.object({
        objectType: z.enum(['flat', 'house', 'floor']),
      }), */
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
