import {z} from 'zod';
import {prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';
import {
  dataUrlFileExtension,
  dataUrlMimeType,
  dataUrlWithoutMetaData,
} from '@remrob/utils';
import {Services_Templates} from '@remrob/mysql';
import {v4 as uuidv4} from 'uuid';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  s3,
} from '@remrob/aws';
import {checkSchema} from '../../modelSchema';

export const proModelsRouter = router({
  proLoadModels: protectedProcedure.query(async ({ctx}) => {
    const models = await prisma.models.findMany({
      select: {
        model_id: true,
        model_name_en: true,
        model_name_de: true,
        icon: true,
        json_model_full: true,
        created_at: true,
      },
      where: {user_fk: ctx.session?.userid, terminated_at: null},
    });

    return models;
  }),
  proLoadModel: protectedProcedure
    .input(z.number())
    .query(async ({ctx, input}) => {
      const model = await prisma.models.findFirstOrThrow({
        where: {
          user_fk: ctx.session?.userid,
          terminated_at: null,
          model_id: input,
        },
      });

      const services_templates = (await prisma.$queryRaw`
        select stm.model_fk, st.* from r2db.services_templates st
        inner join r2db.services_templates_models stm
        on stm.service_template_fk=st.service_template_id
        where stm.model_fk=${input}
      `) as Services_Templates[];

      /* const services_templates_orig = (await prisma.services_templates.findMany(
        {
          where: {
            user_fk: ctx.session?.userid,
            terminated_at: null,
            model_fk: input,
          },
        },
      )) as unknown;

      const services_templates =
        services_templates_orig as Services_Templates[]; */

      return {model, services_templates};
    }),

  devModelDelSaga: protectedProcedure
    .input(
      z.object({
        modelId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {modelId} = input;
      const userId = ctx.session?.userid;

      await prisma.$queryRaw`
        UPDATE r2db.models SET terminated_at = now()
        WHERE user_fk = ${userId} and model_id = ${modelId}
      `;
    }),

  adminModelIconUpload: protectedProcedure
    .input(
      z.object({
        modelId: z.number().int(),
        modelImage: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {modelId, modelImage} = input;
      const userId = ctx.session?.userid;
      const uniqueid = uuidv4();

      const ext = dataUrlFileExtension(modelImage);
      const buf = dataUrlWithoutMetaData(modelImage);
      const mime = dataUrlMimeType(modelImage);

      /* const buf = Buffer.from(
        modelImage.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      ); */
      // const buf = Buffer.from(userImage).toString('base64');
      // const mimetype = mime.getExtension(modelImage);
      const newFileName = `${uniqueid}.${ext}`;

      try {
        await prisma.$transaction(async (tx) => {
          /* const oldData = await tx.users.findFirstOrThrow({
          select: {user_image_hash: true},
          where: {user_id: userId},
        }); */
          const oldData = await tx.models.findFirstOrThrow({
            select: {icon: true},
            where: {user_fk: userId, model_id: Number(modelId)},
          });

          await tx.models.updateMany({
            data: {icon: newFileName},
            where: {user_fk: userId, model_id: modelId},
          });

          const uploadObjectCommand = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: `images/icons/models/${newFileName}`,
            ContentType: mime,
            Body: buf,
          });

          await s3.send(uploadObjectCommand);

          const deleteObjectCommand = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: `images/icons/models/${oldData.icon}`,
          });
          await s3.send(deleteObjectCommand);
        });
      } catch (err) {
        console.error(err);
      }
    }),

  asyncProModelCreate: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        descr: z.string(),
        modelData: z.any(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {name, descr, modelData} = input;
      const userId = ctx.session?.userid;

      const check = checkSchema(modelData);

      if (!check.valid) {
        const temp = check.errors?.[0]
          ? {status: 470, error: check.errors?.[0]?.stack}
          : null;
        return temp;
      }

      const iconKey = `${uuidv4()}.png`;
      const res = await prisma.$transaction(async (tx) => {
        const newModel = await tx.models.create({
          data: {
            user_fk: userId,
            model_name_en: name,
            model_name_de: name,
            model_descr_en: descr,
            model_descr_de: descr,
            json_model_full: modelData,
            icon: iconKey,
            mapping_in: {},
            mapping_out: {},
            initial_commands: {},
            object_configuration_initial: '{}',
          },
        });

        const newModelID = newModel.model_id;
        if (!newModelID) {
          throw new Error(`Problem with new model creation in db`);
        }

        const command = new CopyObjectCommand({
          Bucket: process.env.S3_BUCKET || '',
          CopySource: `/${process.env.S3_BUCKET}/images/icons/models/no_icon.png`,
          Key: `images/icons/models/${iconKey}`,
        });

        await s3.send(command);

        return {status: 200, modelid: newModelID};
      });
      return res;
    }),
});
