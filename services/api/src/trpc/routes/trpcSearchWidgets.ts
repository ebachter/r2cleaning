import {z} from 'zod';
import {Prisma, prisma} from '@remrob/mysql';
import {router, protectedProcedure, publicProcedure} from '../middleware';

export const searchWidgetsRouter = router({
  searchWidgets: protectedProcedure
    .input(z.object({queryString: z.string().nullable()}))
    .query(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {queryString} = input;
      const qs = queryString ? parseInt(queryString) : '';

      const rows = (await prisma.$queryRaw`
        SELECT w.widget_template_id, ${Prisma.raw(
          `w.name_${lang}`,
        )} as name, w.icon_color, u.username as userName
        FROM r2db.widgets_templates w
        LEFT OUTER JOIN r2db.widgets_templates_models wm ON wm.widget_template_fk=w.widget_template_id
        INNER JOIN r2db.users u ON u.user_id = w.user_fk
        WHERE
        ${
          queryString !== 'null'
            ? Prisma.sql`(${Prisma.raw(
                `w.name_${lang}`,
              )} like ${`%${queryString}%`} OR w.widget_template_id = ${qs} OR wm.model_fk = ${qs}) AND`
            : Prisma.empty
        }
        (w.user_fk = ${userId} OR w.is_public = 1)
        GROUP by w.widget_template_id
        LIMIT 10;
      `) as {
        widget_template_id: number;
        name: string;
        icon_color: string;
        userName: string;
      }[];

      return rows;
    }),
  searchWidget: protectedProcedure
    .input(z.number().int())
    .query(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const widgetId = input;

      const widget = (await prisma.$queryRaw`
        SELECT ${Prisma.raw(
          `w.name_${lang}`,
        )} as name, w.descr_de as descr, w.user_fk as userId, w.icon_color, u.username as userName
        FROM r2db.widgets_templates w
        INNER JOIN r2db.users u ON u.user_id = w.user_fk
        WHERE w.widget_template_id = ${Prisma.raw(String(widgetId))}
        GROUP by w.widget_template_id;    
      `) as {
        name: string;
        descr: string;
        userId: string;
        iconColor: string;
        userName: string;
      }[];

      const models = (await prisma.$queryRaw`
        SELECT wm.model_fk as modelId, ${Prisma.raw(
          `json_model_full->>'$.name.${lang}'`,
        )} as name, m.icon
        FROM r2db.widgets_templates_models wm
        INNER JOIN r2db.models m on m.model_id = wm.model_fk
        WHERE wm.widget_template_fk=${widgetId}
      `) as {modelId: number; name: string; icon: string}[];
      return {widget: widget[0], models};
    }),
});
