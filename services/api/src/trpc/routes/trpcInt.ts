import {z} from 'zod';
import {prisma, TypeOrder} from '@remrob/mysql';
import {router, publicProcedure, protectedProcedure} from '../middleware';
import {v4 as uuidv4} from 'uuid';
import {
  checkUserPassword,
  createUserAuthToken,
  createUserSessionToken,
} from '@remrob/utils';
import axios from 'axios';
import {
  sendEmailForReset,
  sendEmailForSignup,
} from '../../functions/functionsEmail';
import log from '@remrob/log';
import DataSource, {User, Verification} from '@remrob/db';
import {sendSMS} from '@remrob/aws';
import AppDataSourceSqlite from '@remrob/db';
import {Order} from '@remrob/db';
import typia from 'typia';

type SessionReturn = {
  sessionToken?: string;
  refreshToken?: string;
  error?: {status: 401 | 500};
};

export const intRouter = router({
  createOrder: protectedProcedure
    .input(
      typia.createAssert<Omit<TypeOrder, 'user_fk'>>(),
      /* z.object({
        objectType: z.enum(['flat', 'house', 'floor']),
      }), */
    )
    .mutation(async ({ctx, input}) => {
      console.log('--ctx--', ctx.session);
      const userId = ctx.session?.userid;
      const {objectType} = input;

      const newOrder: TypeOrder = {objectType, user_fk: userId};
      // const order = new Order();
      // order.objectType = newOrder.objectType; // as TypeOrder['objectType'];
      // order.user_fk = newOrder.user_fk;

      // const data = AppDataSourceSqlite.getRepository(Order).metadata.columns;
      const order = AppDataSourceSqlite.getRepository(Order).create(newOrder);
      // console.log('tableName', data);

      const temp = await AppDataSourceSqlite.manager.save(order);
      console.log('--temp--', temp);
    }),

  loadOrders: publicProcedure.query(async ({ctx}) => {
    const data = await AppDataSourceSqlite.getRepository(Order).find();
    console.log('--temp--', data);

    return data;
  }),
});