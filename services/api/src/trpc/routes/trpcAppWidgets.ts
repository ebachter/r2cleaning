import {z} from 'zod';
import {Prisma, prisma} from '@remrob/mysql';
import {router, protectedProcedure, publicProcedure} from '../middleware';
import {Color} from '@remrob/mysql';

export const appWidgetsRouter = router({
  appLoadWidgets: protectedProcedure.query(async ({ctx}) => {
    const {userId, lang} = ctx.session;

    const data = (await prisma.$queryRaw`
    SELECT 
      wb.widget_id, 
      w.user_fk, 
      w.widget_template_id, 
      w.icon_color, 
      u.username as creatorid, ${Prisma.raw(
        `w.name_${lang}`,
      )} as name, ${Prisma.raw(`w.descr_${lang}`)} as descr, 
      wb.project_fk, 
      t.name as project_name, 
      t.color as project_color
    FROM r2db.widgets wb
      INNER JOIN r2db.widgets_templates w ON w.widget_template_id=wb.widget_template_fk
      INNER JOIN r2db.users u ON u.user_id = w.user_fk
      LEFT OUTER JOIN r2db.projects t ON t.project_id = wb.project_fk 
    WHERE w.terminated_at is null AND wb.user_fk=${userId};
  `) as {
      user_fk: number;
      widget_id: number;
      widget_template_id: number;
      icon_color: Color;
      creatorid: number;
      name: string;
      descr: string;
      project_fk: number;
      project_name: string;
      project_color: Color;
    }[];

    const models = (await prisma.$queryRaw`
      SELECT wm.widget_template_fk, wm.model_fk, m.icon, ${Prisma.raw(
        `m.json_model_full->>'$.name.${lang}'`,
      )} as name
      FROM r2db.widgets_templates_models wm
      INNER JOIN r2db.widgets_templates w ON wm.widget_template_fk = w.widget_template_id
      INNER JOIN r2db.models m ON m.model_id = wm.model_fk
      WHERE w.terminated_at is null AND w.widget_template_id in 
        (select widget_template_fk from r2db.widgets where user_fk = ${userId});
    `) as {
      widget_template_fk: number;
      model_fk: number;
      icon: string;
      name: string;
    }[];

    /* const provisions = await prisma.$queryRaw`
    SELECT wp.widgetfk, wp.mqtt_client_id, m.icon, ${Prisma.raw(
      `m.json_model_full->>'$.name.${lang}'`,
    )} as name
    FROM r2db.widgets_provisions wp
    INNER JOIN r2db.widgets_templates w ON wp.widgetfk=w.widgetid
    INNER JOIN r2db.objects_reservations obr ON obr.mqtt_client_id=wp.mqtt_client_id
    INNER JOIN r2db.models m ON m.modelid = obr.model_fk
    WHERE w.terminated_at is null AND w.widgetid in (select widgetid from r2db.widgets where userid = ${userid});
  `; */

    const objects = (await prisma.$queryRaw`
    SELECT wo.widget_template_fk, wo.mqtt_client_fk, m.icon, ${Prisma.raw(
      `m.json_model_full->>'$.name.${lang}'`,
    )} as name
    FROM r2db.widgets_templates_objects wo
    INNER JOIN r2db.widgets_templates w ON wo.widget_template_fk=w.widget_template_id
    INNER JOIN (
      SELECT mqtt_client_id, model_fk, 'existing' as type FROM r2db.objects
      UNION
      SELECT mqtt_client_id, model_fk, 'provisioned' as type FROM r2db.objects_reservations
    ) o ON o.mqtt_client_id = wo.mqtt_client_fk
    INNER JOIN r2db.models m on m.model_id = o.model_fk
    WHERE w.terminated_at is null AND w.widget_template_id in 
      (select widget_template_fk from r2db.widgets where user_fk = ${userId});        
  `) as {widget_template_fk: number; mqtt_client_fk: string; icon: string}[];
    return {bookmarks: data, models, objects};
  }),

  appWidgetDel: protectedProcedure
    .input(
      z.object({
        widgetId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {widgetId} = input;
      const userId = ctx.session?.userid;
      await prisma.widgets.deleteMany({
        where: {user_fk: userId, widget_id: widgetId},
      });
      return {status: 204};
    }),

  appWidgetAdd: protectedProcedure
    .input(
      z.object({
        widgetTemplateId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {widgetTemplateId} = input;

      const widget_template = await prisma.widgets_templates.findFirstOrThrow({
        select: {name_en: true, name_de: true},
      });
      const name = widget_template[`name_${lang}`];

      const widget = await prisma.widgets.create({
        data: {
          widget_template_fk: widgetTemplateId,
          user_fk: userId,
          name,
        },
      });

      return {status: 204, widgetId: widget.widget_id};
    }),
});
