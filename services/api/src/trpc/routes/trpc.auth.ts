import {router, publicProcedure, protectedProcedure} from '../middleware';
// import {sendSMS} from '@remrob/aws';
import drizzle, {user, verification} from '@remrob/drizzle';
import typia, {tags} from 'typia';
import {and, eq, getTableColumns, or, sql} from 'drizzle-orm';
import {sendEmailForSignup} from '../../functions/functionsEmail';
import {TRPCError} from '@trpc/server';
import {
  checkUserPassword,
  createUserAuthToken,
  createUserSessionToken,
} from '../../authentication';

type User = typeof user.$inferSelect;
type Verification_ = typeof verification.$inferSelect;

export const extUserAuthRouter = router({
  login: publicProcedure
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
        language: 'en',
      });

      return {error: 'none', sessionToken};
    }),

  signup: {
    add: publicProcedure
      .input(
        typia.createAssert<{
          firstName: string & tags.MinLength<1> & tags.MaxLength<50>;
          lastName: string & tags.MinLength<1> & tags.MaxLength<50>;
          email: string & tags.Format<'email'>;
          password: string & tags.MinLength<5> & tags.MaxLength<50>; //promocode, reCapString
        }>(),
      )
      .output(typia.createAssert<{status: 'exists' | 'success' | 'error'}>())
      .mutation(async ({ctx, input}) => {
        const {firstName, lastName, email, password} = input;

        const res = await drizzle.transaction(
          async (tx): Promise<{status: 'exists' | 'success' | 'error'}> => {
            const users = await tx
              .select()
              .from(user)
              .where(eq(user.email, email));

            if (users.length > 0) {
              // This throws an exception that rollbacks the transaction.
              // tx.rollback();
              return {status: 'exists'};
            }

            const record = await tx
              .select({
                ...getTableColumns(verification),
                minutesSinceLastUpdate: sql<number>`TIMESTAMPDIFF(MINUTE, ${verification.updatedAt}, now())`,
              })
              .from(verification)
              .where(
                or(
                  eq(verification.email, email),
                  eq(verification.ip, ctx.req.ip || ''),
                ),
              );

            if (record.length && record[0].counter > 5)
              if (record[0].minutesSinceLastUpdate < 2) {
                throw new TRPCError({
                  code: 'BAD_REQUEST',
                  // message: 'An unexpected error occurred, please try again later.',
                  // optional: pass the original error to retain stack trace
                  // cause: theError,
                });
              }

            let verificationCode = Math.floor(
              100000 + Math.random() * 900000,
            ).toString();

            const passwordHash = await createUserAuthToken(password);

            try {
              const res = await tx
                .insert(verification)
                .values({
                  firstName,
                  lastName,
                  email,
                  passwordHash,
                  verificationCode,
                  ip: ctx.req.ip,
                })
                .onDuplicateKeyUpdate({
                  set: {
                    firstName,
                    lastName,
                    email,
                    passwordHash,
                    verificationCode,
                    counter:
                      record[0] && record[0].minutesSinceLastUpdate > 180
                        ? 1
                        : sql`${verification.counter}+1`, // reset counter after 3h
                    ip: ctx.req.ip,
                  },
                });

              sendEmailForSignup(email, verificationCode, 'en');
              return {status: 'success'};
            } catch (e) {
              console.log(e);
              return {status: 'error'};
            }
          },
        );

        return res;
      }),

    confirm: publicProcedure
      .input(
        typia.createAssert<{
          email: string & tags.Format<'email'>;
          verificationCode: string & tags.MinLength<6> & tags.MaxLength<50>; //promocode
        }>(),
      )
      .mutation(async ({ctx, input}) => {
        const {email, verificationCode} = input;

        const res = await drizzle.transaction(
          async (tx): Promise<{status: 'notfound' | 'created' | 'error'}> => {
            const data = await tx.query.verification.findFirst({
              where: and(
                eq(verification.email, email),
                eq(verification.verificationCode, verificationCode),
              ),
            });

            const isAdmin = ['bach1', 'bakhtarov@remrob.com'].includes(email);

            if (data) {
              await tx.insert(user).values({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                isAdmin: isAdmin,
                passwordHash: data.passwordHash,
              });

              await tx
                .delete(verification)
                .where(
                  and(
                    eq(verification.email, email),
                    eq(verification.verificationCode, verificationCode),
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
  },

  /* extUserSignupSMSverify: publicProcedure
    .input(
      typia.createAssert<{
        phoneNumber:
          | NonNullable<Verification_['phoneNumber']>
          | NonNullable<Verification_['email']>;
        verificationCode: NonNullable<Verification_['verificationCode']>;
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
            eq(verification.verificationCode, verificationCode),
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
        verificationCode: genCode,
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
