import {z} from 'zod';
import {prisma, TypeOrder} from '@remrob/mysql';
import {router, publicProcedure} from '../middleware';
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

export const extUserAuthRouter = router({
  extUserSessionCreate: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ctx, input}): Promise<SessionReturn> => {
      const {email: username, password} = input;

      const userTable = DataSource.getRepository(User);
      const user2 = await userTable.find();
      console.log('--user2--', JSON.stringify(user2));

      if (!username || !password) {
        return {error: {status: 401}};
      }

      const user = await prisma.users.findFirstOrThrow({
        select: {
          user_id: true,
          password: true,
          language: true,
        },
        where: {
          email: username,
          NOT: {terminated_at: null},
        },
      }); // email, userlabel, firstname, lastname, timezone, user_image_hash

      if (!user || !user.password) {
        return {error: {status: 401}}; // {info:'false credentials' }
      }

      const match = await checkUserPassword(password, user.password);

      // Encode password and return hash
      if (!match) {
        return {error: {status: 401}}; // { success: 0, info:'false credentials' }
      }

      const refreshToken = uuidv4();
      const rslt =
        await prisma.$executeRaw`UPDATE r2db.users SET refreshToken = ${refreshToken} WHERE user_id = ${user.user_id}`;

      if (rslt !== 1) {
        return {error: {status: 500}};
      }

      const sessionToken = createUserSessionToken({
        userId: user.user_id,
        lang: user.language,
      }); // sessionToken: 'r: Kt9wXIBWD0dNijNIq2u5rRllW',

      return {sessionToken, refreshToken};
    }),

  extUserSignupSMSverify: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        verificationCode: z.string(),
      }),
    )
    .output(
      z
        .object({
          isValid: z.literal(false),
        })
        .or(z.object({isValid: z.literal(true), session: z.string()})),
    )
    .mutation(async ({ctx, input}) => {
      const {phoneNumber, verificationCode} = input;
      console.log({verificationCode});
      const data = await AppDataSourceSqlite.getRepository(
        Verification,
      ).findOne({
        where: {phoneNumber, verificationID: verificationCode},
      });
      console.log('data', data);
      if (!data) return {isValid: false};

      const userData = await AppDataSourceSqlite.getRepository(User).findOne({
        where: {phoneNumber: data.phoneNumber},
      });

      let sessionToken: string = '';
      if (!userData) {
        const user = new User();
        user.phoneNumber = phoneNumber;
        const newUser = await AppDataSourceSqlite.getRepository(User).save(
          user,
        );
        sessionToken = createUserSessionToken({
          userId: newUser.user_id,
          lang: 'en',
        });
      } else {
        sessionToken = createUserSessionToken({
          userId: userData.user_id,
          lang: 'en',
        });
      }

      console.log('--userData--', userData);

      return {isValid: true, session: sessionToken};
    }),

  createOrder: publicProcedure
    .input(
      typia.createAssert<TypeOrder>(),
      /* z.object({
        objectType: z.enum(['flat', 'house', 'floor']),
      }), */
    )
    .mutation(async ({ctx, input}) => {
      const {objectType} = input;

      const order = new Order();
      order.objectType = objectType as TypeOrder['objectType'];

      const data = AppDataSourceSqlite.getRepository(Order).metadata.columns;
      // console.log('tableName', data);

      const temp = await AppDataSourceSqlite.manager.save(order);
      console.log('--temp--', temp);
    }),

  loadOrders: publicProcedure.query(async ({ctx}) => {
    const data = await AppDataSourceSqlite.getRepository(Order).find();
    console.log('--temp--', data);

    return data;
  }),

  extUserSignupSMS: publicProcedure
    .input(
      z.object({
        phone: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {phone} = input;

      // let genCode = (Math.random() + 1).toString(36).substring(2, 8); //.toUpperCase();
      let genCode = Math.floor(100000 + Math.random() * 900000).toString();

      const verification = new Verification();
      verification.phoneNumber = phone;
      verification.verificationID = genCode;

      console.log(verification);
      await AppDataSourceSqlite.manager.save(verification);
      const message = `Verification code: ${genCode}`;
      await sendSMS(phone, message);
    }),

  extUserSignup: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        promocode: z.string(),
        reCapString: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {name, email, password, promocode, reCapString} = input;
      if (!name || !email || promocode !== 'r2promo' || password.length < 5) {
        return {status: 400};
      }
      // ReCaptcha Verification
      let result = await axios({
        method: 'post',
        url: 'https://www.google.com/recaptcha/api/siteverify',
        params: {
          secret: process.env.RECAP_SITE_SECRET_KEY,
          response: reCapString,
        },
      });
      let data = result.data;
      if (!data?.success) {
        return {status: 400};
      }

      const existingUser = await prisma.users.findFirst({where: {email}});
      if (existingUser) {
        return {status: 409};
      }

      const pwdHash = await createUserAuthToken(password);

      const language = 'en'; // (req.cookies && req.cookies.lang) ? ||
      const timezone = 'Europe/Berlin';
      const tempid = uuidv4();

      const insertRes = await prisma.$executeRaw`
          INSERT INTO r2db.users_new (temp_id, email, password, name, language, timezone)
          VALUES (${tempid}, ${email}, ${pwdHash}, ${name}, ${language}, ${timezone})
          ON DUPLICATE KEY UPDATE temp_id = VALUES(temp_id), password = VALUES(password), name = VALUES(name), language = VALUES(language), timezone = VALUES(timezone), attempts = attempts + 1
        `;

      if (insertRes === 0) {
        throw new Error('Signup insert error');
      }
      await sendEmailForSignup(email, tempid, language);
      return {status: 204};
    }),

  precheckPasswordResetTokenExt: publicProcedure
    // url: '/reset/password/external/confirmed',
    .input(
      z.object({
        resetId: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {resetId} = input;

      const result = await prisma.users_reset_password.findUnique({
        select: {temp_id: true},
        where: {temp_id: resetId},
      });
      if (!result) {
        return {status: 204};
      } else {
        return {status: 202};
      }
    }),

  asyncUserPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {email} = input;
      // export async function asyncUserPasswordReset({email}: {email: string}) {

      const userData = await prisma.users.findFirst({
        select: {language: true},
        where: {email, NOT: {terminated_at: null}},
      });
      if (!userData) {
        // res.status(500).end(); // return res.redirect('// remrob.com/login');
        return {status: 500};
      }

      try {
        const tempid = uuidv4();
        await prisma.$executeRaw`
          INSERT INTO r2db.users_reset_password(temp_id, email, counter)
          VALUES (${tempid}, ${email}, ${0})
          ON DUPLICATE KEY UPDATE temp_id = VALUES(temp_id), counter = counter + 1
        `; // user_id as mng_id,
        await sendEmailForReset(email, tempid, userData.language);
        return {status: 204};
      } catch (err) {
        log.error(err, '/reset/password/external err');
        return {status: 500};
      }
    }),

  asyncExtUserPasswordResetConfirm: publicProcedure
    .input(
      z.object({
        resetId: z.string(),
        password1: z.string(),
        password2: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {resetId, password1, password2} = input;

      const pwdHash = await createUserAuthToken(password1);
      await prisma.$transaction(async (tx) => {
        const affectedRows = await tx.$executeRaw`
        UPDATE r2db.users u
        INNER JOIN r2db.users_reset_password urp
        ON urp.email = u.email and urp.temp_id = ${resetId}
        SET u.password = ${pwdHash}
      `;

        if (affectedRows !== 1) {
          return {status: 404};
        }

        await tx.$executeRaw`
          DELETE FROM r2db.users_reset_password WHERE temp_id = ${resetId}
        `;
      });

      return {status: 204};
    }),

  signupConfirmExt: publicProcedure
    .input(
      z.object({
        signupId: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {signupId} = input;

      const res = await prisma.$transaction(async (tx) => {
        const tempUser = await tx.users_new.findUnique({
          where: {
            temp_id: signupId,
          },
        });

        if (!tempUser) {
          return {status: 404};
        }

        const newUser = await tx.users.create({
          data: {
            email: tempUser.email,
            username: '',
            name: tempUser.name,
            language: 'en',
            timezone: 'Europe/Berlin',
            password: tempUser.password,
            user_image_hash: 'no_icon.png',
          },
        });

        if (!newUser.user_id) throw new Error('Signup insert error');

        await tx.users.update({
          data: {
            username: String(newUser.user_id),
          },
          where: {
            user_id: newUser.user_id,
          },
        });

        await tx.users_new.delete({
          where: {
            temp_id: signupId,
          },
        });

        await tx.$executeRaw`
          INSERT INTO r2data.timeline(user_fk, operation, data) VALUES (${newUser.user_id},'userRegistration','{}')
        `;

        return {status: 204};
      });
      return res;
    }),
});
