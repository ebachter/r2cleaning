import {z} from 'zod';
import {Prisma, prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';
import {
  dataUrlFileExtension,
  dataUrlMimeType,
  dataUrlWithoutMetaData,
  getRandomColor,
} from '@remrob/utils';
import {v4 as uuidv4} from 'uuid';
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  Upload,
  s3,
} from '@remrob/aws';

export const widgetsRouter = router({
  proLoadWidgets: protectedProcedure.query(async (params) => {
    const {ctx} = params;
    const widgets = await prisma.widgets_templates.findMany({
      select: {
        widget_template_id: true,
        icon_color: true,
        name_en: true,
        name_de: true,
      },
      where: {user_fk: ctx.session?.userid, terminated_at: null},
    });
    return {widgets};
  }),
  proLoadWidget: protectedProcedure.input(z.number()).query(async (params) => {
    const {ctx, input: widgetId} = params;
    const widget = await prisma.widgets_templates.findFirst({
      where: {
        widget_template_id: widgetId,
        user_fk: ctx.session?.userid,
        terminated_at: null,
      },
    });
    const models = (await prisma.$queryRaw`
      SELECT wm.widget_template_fk, wm.model_fk, m.icon, ${Prisma.raw(
        `m.json_model_full->>'$.name.${ctx.session?.language}'`,
      )} as name
      FROM r2db.widgets_templates_models wm
      INNER JOIN r2db.widgets_templates w on w.widget_template_id=wm.widget_template_fk
      INNER JOIN r2db.models m on m.model_id = wm.model_fk
      WHERE w.terminated_at is null AND w.user_fk = ${
        ctx.session?.userid
      } AND w.widget_template_id=${widgetId};
    `) as {model_fk: number; name: string; icon: string}[]; //req.input.widgetId

    const objects = (await prisma.$queryRaw`
      SELECT wo.widget_template_fk, wo.mqtt_client_fk, m.icon, ${Prisma.raw(
        `m.json_model_full->>'$.name.${ctx.session?.language}'`,
      )} as name, o.type
      FROM r2db.widgets_templates_objects wo
      INNER JOIN
      (
        SELECT mqtt_client_id, model_fk, 'existing' as type FROM r2db.objects
        UNION
        SELECT mqtt_client_id, model_fk, 'provisioned' as type FROM r2db.objects_reservations
      ) o ON o.mqtt_client_id = wo.mqtt_client_fk
      INNER JOIN r2db.models m on m.model_id = o.model_fk
      INNER JOIN r2db.widgets_templates w on w.widget_template_id=wo.widget_template_fk

      WHERE w.terminated_at is null AND w.user_fk = ${
        ctx.session?.userid
      } and w.widget_template_id=${widgetId};
    `) as {
      widget_template_fk: number;
      model_fk: number;
      icon: string;
      name: string;
    }[];
    return {widget, models, objects};
  }),

  adminWidgetPublicSet: protectedProcedure
    .input(
      z.object({
        widgetId: z.number(),
        publicType: z.enum(['private', 'public']),
        activationFee: z.number(),
        monthlyFee: z.number(),
        currency: z.enum(['eur', 'usd']),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {widgetId, publicType, activationFee, monthlyFee, currency} = input;
      const userId = ctx.session?.userid;

      await prisma.widgets_templates.updateMany({
        data: {
          is_public: publicType === 'public',
          activation_fee: activationFee,
          monthly_fee: monthlyFee,
          currency,
        },
        where: {
          user_fk: userId,
          widget_template_id: widgetId,
          terminated_at: null,
        },
      });

      /* await prisma.$executeRaw`
          UPDATE r2db.widgets_templates
          SET isPublic = ${
            publicType === 'public' ? 1 : 0
          }, activationFee = ${activationFee}, monthlyFee = ${monthlyFee}, currency = ${currency}
          WHERE user_fk = ${userId} AND widget_template_id = ${widgetId} AND terminated_at is null;
        `; */
      return {status: 204};
    }),

  adminWidgetReferenceSet: protectedProcedure
    .input(
      z.object({
        widgetId: z.number().optional(),
        modelId: z.number().optional(),
        mqttClientId: z.string().optional(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {widgetId, modelId, mqttClientId} = input;
      const userId = ctx.session?.userid;

      if (modelId && widgetId) {
        await prisma.$executeRaw`
        INSERT INTO r2db.widgets_templates_models (widget_template_fk, model_fk)
        SELECT w.widget_template_id, ${modelId}
        FROM r2db.widgets_templates w
        WHERE w.widget_template_id = ${widgetId} AND w.user_fk=${userId};
      `;
      }
      if (mqttClientId && widgetId) {
        const reservationExists = await prisma.objects_reservations.findUnique({
          where: {
            mqtt_client_id: mqttClientId,
          },
        });

        await prisma.$executeRaw`
        INSERT INTO r2db.widgets_templates_objects (widget_template_fk, ${Prisma.raw(
          reservationExists
            ? 'mqtt_client_id_reservation'
            : 'mqtt_client_id_object',
        )})
        SELECT w.widget_template_id, ${mqttClientId}
        FROM r2db.widgets_templates w
        WHERE w.widget_template_id = ${widgetId} AND w.user_fk=${userId};
      `;
      }
    }),

  adminWidgetLabelUpdate: protectedProcedure
    .input(
      z.object({
        widgetId: z.number(),
        nameEn: z.string(),
        nameDe: z.string(),
        descrEn: z.string(),
        descrDe: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {widgetId, nameEn, nameDe, descrEn, descrDe} = input;
      const userId = ctx.session?.userid;

      await prisma.widgets_templates.updateMany({
        data: {
          name_en: nameEn,
          name_de: nameDe,
          descr_en: descrEn,
          descr_de: descrDe,
        },
        where: {
          user_fk: userId,
          widget_template_id: widgetId,
        },
      });
    }),

  devWidgetCreateSaga: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        descr: z.string(),
        widgetFiles: z
          .object({fileName: z.string(), dataUrl: z.string()})
          .array(),
        // referencedObjects: z.any(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {name, descr, widgetFiles} = input;
      const userId = ctx.session.userid;
      const uniqueid = uuidv4();

      const res = await prisma.$transaction(async (tx) => {
        // Code running in a transaction...
        const widget = await tx.widgets_templates.create({
          data: {
            user_fk: userId,
            name_en: name,
            name_de: name,
            descr_en: descr,
            descr_de: descr,
            icon_color: getRandomColor(),
          },
        });

        const newWidgetId = widget.widget_template_id;

        const promises = widgetFiles.map(({fileName, dataUrl}) => {
          const mime = dataUrlMimeType(dataUrl);
          const buf = dataUrlWithoutMetaData(dataUrl);

          return new Upload({
            client: s3,
            params: {
              Bucket: process.env.S3_BUCKET!,
              Key: `widgets/${newWidgetId}/${fileName}`,
              ContentType: mime,
              Body: buf,
            },
          });
        });

        await Promise.all(promises);

        return {status: 200, newWidgetId};
      });
      return res;
    }),
  devWidgetDelSaga: protectedProcedure
    .input(
      z.object({
        widgetId: z.number(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {widgetId} = input;
      const userId = ctx.session.userid;

      await prisma.$executeRaw`
        UPDATE r2db.widgets_templates SET terminated_at = now() WHERE user_fk = ${userId} AND widget_template_id = ${widgetId}
      `;

      const params = {
        Bucket: process.env.S3_BUCKET!,
        Prefix: `widgets/${widgetId}/`,
      };

      const command = new ListObjectsV2Command(params);
      const results = await s3.send(command);

      const deleteObjectsCommand = new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET,
        Delete: {
          Objects: (results.Contents || []).map((content) => ({
            Key: content.Key,
          })),
        },
      });

      await s3.send(deleteObjectsCommand);
    }),
});
