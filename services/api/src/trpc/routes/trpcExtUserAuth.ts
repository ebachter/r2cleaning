import {router, publicProcedure, protectedProcedure} from '../middleware';
import {
  checkUserPassword,
  createUserAuthToken,
  createUserSessionToken,
} from '@remrob/utils';
import {sendSMS} from '@remrob/aws';
import drizzle, {user, verification} from '@remrob/drizzle';
import typia from 'typia';
import {and, eq} from 'drizzle-orm';
import {sendEmailForSignup} from '../../functions/functionsEmail';

type User = typeof user.$inferSelect;
type Verification_ = typeof verification.$inferSelect;

export const extUserAuthRouter = router({
  extUserSignupEmail: publicProcedure
    .input(
      typia.createAssert<{
        firstName: string;
        lastName: string;
        email: string;
        password: string; //promocode, reCapString
      }>(),
    )
    .output(typia.createAssert<{status: 'exists' | 'verify' | 'error'}>())
    .mutation(async ({input}) => {
      const {firstName, lastName, email, password} = input;

      const res = await drizzle.transaction(
        async (tx): Promise<{status: 'exists' | 'verify' | 'error'}> => {
          const users = await tx
            .select()
            .from(user)
            .where(eq(user.email, email));
          if (users.length > 0) {
            // This throws an exception that rollbacks the transaction.
            // tx.rollback();
            return {status: 'exists'};
          }

          let verificationId = Math.floor(
            100000 + Math.random() * 900000,
          ).toString();

          const passwordHash = await createUserAuthToken(password);
          try {
            await tx
              .insert(verification)
              .values({
                firstName,
                lastName,
                email,
                passwordHash,
                verificationId,
              })
              .onDuplicateKeyUpdate({set: {verificationId, passwordHash}});

            sendEmailForSignup(email, verificationId, 'en');
            return {status: 'verify'};
          } catch (e) {
            return {status: 'error'};
          }
        },
      );

      return res;
    }),

  extUserSignupEmailVerify: publicProcedure
    .input(
      typia.createAssert<{
        email: string;
        verificationCode: string; //promocode, reCapString
      }>(),
    )
    .mutation(async ({ctx, input}) => {
      const {email, verificationCode} = input;

      const res = await drizzle.transaction(
        async (tx): Promise<{status: 'notfound' | 'created' | 'error'}> => {
          const data = await tx.query.verification.findFirst({
            where: and(
              eq(verification.email, email),
              eq(verification.verificationId, verificationCode),
            ),
          });

          if (data) {
            await tx.insert(user).values({
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              passwordHash: data.passwordHash,
            });

            await tx
              .delete(verification)
              .where(
                and(
                  eq(verification.email, email),
                  eq(verification.verificationId, verificationCode),
                ),
              );

            return {status: 'created'};
          } else {
            return {status: 'notfound'};
          }
        },
      );
      return res;
    }),

  extUserLoginVerify: publicProcedure
    .input(
      typia.createAssert<{
        email: NonNullable<Verification_['email']>;
        password: string;
      }>(),
    )
    .output(
      typia.createAssert<{
        error: 'credentialsNotValid' | 'none';
        sessionToken?: string;
      }>(),
    )
    .mutation(async ({input}) => {
      const {email, password} = input;

      const userData = await drizzle.query.user.findFirst({
        where: eq(user.email, email),
      });

      if (!userData) {
        return {error: 'credentialsNotValid'};
      }

      const match = await checkUserPassword(password, userData.passwordHash);
      if (!match) {
        return {error: 'credentialsNotValid'}; // { success: 0, info:'false credentials' }
      }

      let sessionToken = createUserSessionToken({
        userId: userData.id,
        lang: 'en',
      });

      return {error: 'none', sessionToken};
    }),

  /* extUserSignupSMSverify: publicProcedure
    .input(
      typia.createAssert<{
        phoneNumber:
          | NonNullable<Verification_['phoneNumber']>
          | NonNullable<Verification_['email']>;
        verificationCode: NonNullable<Verification_['verificationId']>;
        loginType: 'email' | 'phone';
      }>(),
    )
    .mutation(async ({ctx, input}) => {
      const {phoneNumber, loginType, verificationCode} = input;
      console.log({verificationCode});

      const data = await drizzle
        .select()
        .from(verification)
        .where(
          and(
            loginType === 'email'
              ? eq(verification.email, phoneNumber)
              : eq(verification.phoneNumber, phoneNumber),
            eq(verification.verificationId, verificationCode),
          ),
        );

      if (!data) return {isValid: false};

      const userData = await drizzle.query.user.findFirst({
        where:
          loginType === 'email'
            ? eq(user.email, phoneNumber)
            : eq(user.phoneNumber, phoneNumber),
        // eq(user.phoneNumber, data[0].phoneNumber),
      });

      let sessionToken: string = '';
      if (!userData) {
        const newUser = await drizzle
          .insert(user)
          .values(
            loginType === 'email'
              ? {email: phoneNumber}
              : {phoneNumber: phoneNumber},
          );
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

      return {isValid: true, session: sessionToken};
    }), */

  extUserSignupSMS: publicProcedure
    .input(
      typia.createAssert<{
        phone: NonNullable<User['phoneNumber']>;
        loginType: 'email' | 'phone';
      }>(),
    )
    .mutation(async ({ctx, input}) => {
      const {phone, loginType} = input;

      // let genCode = (Math.random() + 1).toString(36).substring(2, 8); //.toUpperCase();
      let genCode = Math.floor(100000 + Math.random() * 900000).toString();

      /* await drizzle.insert(verification).values({
        ...(loginType === 'email' ? {email: phone} : {phoneNumber: phone}),
        verificationId: genCode,
      }); */ //.query.order.findMany({with: {object: true}});

      console.log('###', genCode);

      const message = `Verification code: ${genCode}`;
      if (loginType === 'email') {
        sendEmailForSignup(phone, genCode, 'en');
      }
      // await sendSMS(phone, message);
    }),

  authCheckToken: protectedProcedure.query(async ({ctx, input}) => {
    return true;
  }),
});
