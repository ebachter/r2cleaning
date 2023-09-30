import {z} from 'zod';
import {getRedisClient, Prisma, prisma} from '@remrob/mysql';
import {router, protectedProcedure, publicProcedure} from '../middleware';
import {projects_chats, projects} from '@remrob/mysql';
import {ChatMessage} from '@remrob/mysql';

export const appProjectChatRouter = router({
  appProjectChatLoad: protectedProcedure
    .input(
      z.object({
        projectId: z.number().int(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {projectId} = input;
      const userId = ctx.session?.userid;

      const project = (await prisma.$queryRaw`
        SELECT t.project_id, t.name, t.color, t.descr, t.type
        FROM r2db.projects t
        LEFT OUTER JOIN r2db.projects_users tu on t.project_id = tu.project_fk
        WHERE t.project_id=${projectId} AND (t.user_fk = ${userId} OR tu.user_fk = ${userId});
      `) as projects;

      const feed = (await prisma.$queryRaw`
        SELECT distinct c.message_id, c.project_fk, c.text, c.user_fk, c.created_at, c.chat_image
        FROM r2db.projects_chats c
        INNER JOIN r2db.projects t ON t.project_id = c.project_fk
        LEFT JOIN r2db.projects_users tu ON tu.project_fk = c.project_fk
        WHERE c.project_fk=${projectId} AND (t.user_fk=${userId} OR tu.user_fk=${userId});
      `) as projects_chats[];

      /* const widgets = await prisma.$queryRaw`
      SELECT wb.widgetid, wb.project_fk as project_id, w.name_en as widget_name, w.iconColor as icon_color
      FROM r2db.widgets wb
      INNER JOIN r2db.widgets_templates w ON w.widget_template_id=wb.widgetid
      WHERE wb.project_fk=${projectId} AND wb.userid=${userId};
    `; */

      return {project, feed};
    }),
  appProjectChatPost: protectedProcedure
    .input(
      z.object({
        projectId: z.number().int(),
        message: z.string(),
        chatImage: z.string().nullable(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {projectId, message, chatImage} = input;
      const userId = ctx.session?.userid;

      await prisma.projects_chats.create({
        data: {
          project_fk: projectId,
          text: message,
          user_fk: userId,
          chat_image: chatImage,
        },
      });
      // Notify other topic members about new message
      const sel = (await prisma.$queryRaw`
          SELECT user_fk FROM r2db.projects_users WHERE project_fk = ${projectId} AND user_fk <> ${userId}
          UNION
          SELECT user_fk FROM r2db.projects WHERE project_id = ${projectId} AND user_fk <> ${userId}
        `) as {user_fk: number}[];

      const projectUsers = sel.map((o) => o.user_fk);
      projectUsers.push(userId);

      const redisClient = getRedisClient();

      projectUsers.forEach((user_fk) => {
        const chatMessage: ChatMessage = {
          projectId,
          message,
          chatImage,
        };
        redisClient.publish(`chatuser:${user_fk}`, JSON.stringify(chatMessage));
      });
    }),
});
