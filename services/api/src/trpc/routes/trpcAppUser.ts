import {z} from 'zod';
import {
  checkUserPassword,
  createUserAuthToken,
  createUserSessionToken,
  dataUrlWithoutMetaData,
} from '@remrob/utils';
import {v4 as uuidv4} from 'uuid';
import {prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';
// import type {TypeUser} from '@remrob/utils';
import {userSchema} from '@remrob/mysql';
import {DeleteObjectCommand, PutObjectCommand, Upload, s3} from '@remrob/aws';

// const languageOptions: z.ZodType<User['language']> = z.enum(['en', 'de']);

// const redisCon = getRedisClient();

export const trpcAppUserRouter = router({
  trpcAppSessionTokenRefresh: protectedProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {refreshToken} = input;
      const userId = ctx.session?.userid;

      const userData = await prisma.users.findFirstOrThrow({
        select: {user_id: true, language: true},
        where: {
          user_id: userId,
          refreshToken: refreshToken,
          NOT: {terminated_at: null},
        },
      });

      const refreshTokenNew = uuidv4();
      await prisma.users.update({
        data: {refreshToken: refreshTokenNew},
        where: {user_id: userData.user_id},
      });

      const sessionToken = createUserSessionToken({
        userId: userData.user_id,
        lang: userData.language,
      });

      return {sessionToken, refreshToken};
    }),

  trpcAppUserDataLoad: protectedProcedure.query(async ({ctx}) => {
    const userId = ctx.session?.userid;

    const user = await prisma.users.findUniqueOrThrow({
      /* select: {
        user_id: true,
        email: true,
        username: true,
        name: true,
        language: true,
        timezone: true,
        user_image_hash: true,
        plan: true,
      }, */
      where: {user_id: userId},
    });

    return user;
  }),

  trpcAppUserSettingsChange: protectedProcedure
    .input(
      z.object({
        changes: z
          .object({
            language: userSchema.shape.language,
            username: z.string(),
            name: z.string(),
            email: z.string(),
            timezone: z.string(),
          })
          .partial()
          .refine((obj) => Object.values(obj).some((v) => v !== undefined), {
            message: 'One of the fields must be defined',
          }),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const userId = ctx.session?.userid;
      const {language, username, name, email, timezone} = input.changes;

      const changesNew: {[key: string]: string} = {};
      if (language) changesNew.language = language;
      if (username) changesNew.username = username;
      if (name) changesNew.name = name;
      if (email) changesNew.email = email;
      if (timezone) changesNew.timezone = timezone;

      await prisma.users.update({
        data: changesNew,
        where: {user_id: userId},
      });

      return {status: 204};
    }),

  trpcAppUserImageUpdate: protectedProcedure
    .input(
      z.object({
        userImage: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userImage} = input;
      const userId = ctx.session?.userid;
      const uniqueid = uuidv4();

      // console.log('userImage', userImage);

      /* const buf = Buffer.from(
        userImage.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      ); */
      const buf = dataUrlWithoutMetaData(userImage);

      // const buf = Buffer.from(userImage).toString('base64');

      try {
        await prisma.$transaction(async (tx) => {
          const oldData = await tx.users.findFirstOrThrow({
            select: {user_image_hash: true},
            where: {user_id: userId},
          });
          await tx.users.update({
            data: {user_image_hash: `${uniqueid}.png`},
            where: {user_id: userId},
          });

          const uploadObjectCommand = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: `images/users/${uniqueid}.png`,
            Body: buf,
          });

          await s3.send(uploadObjectCommand);

          const deleteObjectCommand = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: `images/users/${oldData.user_image_hash}.png`,
          });
          await s3.send(deleteObjectCommand);
        });
      } catch (err) {
        console.error(process.env.S3_BUCKET, err);
      }
    }),

  deleteUserAccountConfirmed: protectedProcedure
    .input(z.object({password: z.string()}))
    .mutation(async ({ctx, input}) => {
      const {password} = input;
      const userId = ctx.session?.userid;

      const result = await prisma.users.findUnique({
        select: {
          password: true,
        },
        where: {
          user_id: userId,
        },
      });

      const match = result?.password
        ? await checkUserPassword(password, result?.password)
        : null;

      if (!match) {
        return {status: 401};
      }
      await prisma.users.update({
        data: {terminated_at: new Date()},
        where: {user_id: userId},
      });
      return {status: 204};
    }),

  resetUserPasswordInt: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
        verifyPassword: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {oldPassword, newPassword, verifyPassword} = input;
      const userId = ctx.session?.userid;

      if (
        !oldPassword ||
        !newPassword ||
        newPassword !== verifyPassword ||
        oldPassword === newPassword
      ) {
        return {error: 403};
      }

      const newPwdHash = await createUserAuthToken(newPassword);

      const user = await prisma.users.findUnique({
        where: {user_id: userId},
      });
      if (!user?.password) {
        return {status: 403};
      }

      const match = await checkUserPassword(oldPassword, user.password);
      if (!match) {
        return {status: 403};
      }

      await prisma.users.update({
        data: {password: newPwdHash},
        where: {user_id: userId},
      });

      return {status: 204};
    }),

  appPlanActivate: protectedProcedure
    .input(
      z.object({
        plan: userSchema.shape.plan,
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {plan} = input;
      const userId = ctx.session?.userid;
      await prisma.users.update({
        data: {plan},
        where: {user_id: userId},
      });
      return {status: 204};
    }),
});
