import {router, publicProcedure, protectedProcedure} from '../middleware';
import {createUserSessionToken} from '@remrob/utils';
import {sendSMS} from '@remrob/aws';
import drizzle, {user, verification} from '@remrob/drizzle';
import typia from 'typia';
import {and, eq} from 'drizzle-orm';

type User = typeof user.$inferSelect;
type Verification_ = typeof verification.$inferSelect;

type SessionReturn = {
  sessionToken?: string;
  refreshToken?: string;
  error?: {status: 401 | 500};
};

export const extUserAuthRouter = router({
  extUserSignupSMSverify: publicProcedure
    .input(
      typia.createAssert<{
        phoneNumber: Verification_['phoneNumber'];
        verificationCode: Verification_['verificationId'];
      }>(),
    )
    .mutation(async ({ctx, input}) => {
      const {phoneNumber, verificationCode} = input;
      console.log({verificationCode});

      const data = await drizzle
        .select()
        .from(verification)
        .where(
          and(
            eq(verification.phoneNumber, phoneNumber),
            eq(verification.verificationId, verificationCode),
          ),
        );
      console.log('data', data);
      if (!data) return {isValid: false};

      const userData = await drizzle.query.user.findFirst({
        where: eq(user.phoneNumber, data[0].phoneNumber),
      });

      let sessionToken: string = '';
      if (!userData) {
        const newUser = await drizzle
          .insert(user)
          .values({phoneNumber} as User);
        sessionToken = createUserSessionToken({
          userId: newUser[0].insertId,
          lang: 'en',
        });
      } else {
        sessionToken = createUserSessionToken({
          userId: userData.id,
          lang: 'en',
        });
      }
      console.log('--userData--', userData);
      return {isValid: true, session: sessionToken};
    }),

  extUserSignupSMS: publicProcedure
    .input(typia.createAssert<{phone: User['phoneNumber']}>())
    .mutation(async ({ctx, input}) => {
      const {phone} = input;

      // let genCode = (Math.random() + 1).toString(36).substring(2, 8); //.toUpperCase();
      let genCode = Math.floor(100000 + Math.random() * 900000).toString();

      // const verification = new Verification();
      // verification.phoneNumber = phone;
      // verification.verificationID = genCode;
      //
      // console.log(verification);
      // await AppDataSourceSqlite.manager.save(verification);

      type Vrf = typeof verification.$inferInsert;
      const obj: Omit<Vrf, 'id'> = {
        phoneNumber: phone,
        verificationId: genCode,
      };

      const data = await drizzle.insert(verification).values(obj as Vrf); //.query.order.findMany({with: {object: true}});

      console.log('###', genCode);

      const message = `Verification code: ${genCode}`;
      // await sendSMS(phone, message);
    }),

  authCheckToken: protectedProcedure.query(async ({ctx, input}) => {
    return true;
  }),
});
