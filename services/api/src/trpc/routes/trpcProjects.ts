import {z} from 'zod';
import {
  Prisma,
  getRedisClient,
  prisma,
  sendCommandToObject,
  sendCommandToUser,
} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';
import {
  models,
  objects,
  projects,
  projects_users,
  users,
  widgets,
  widgets_templates,
} from '@remrob/mysql';
import {TableUsers} from '@remrob/mysql';

const redisClient = getRedisClient();

export const trpcAppProjectsRouter = router({
  trpcAppProjectsLoad: protectedProcedure.query(async ({ctx}) => {
    const {userId, lang} = ctx.session;

    /* const project_users = await prisma.projects_users.findMany({
      select: {project_fk: true},
      where: {
        user_fk: userId,
      },
    });

    const projects = await prisma.projects.findMany({
      where: {
        OR: [
          {user_fk: userId},
          {project_id: {in: project_users.map((o) => o.project_fk)}},
        ],
      },
    }); */

    const projects = (await prisma.$queryRaw`
      SELECT t.project_id, t.name, t.color, t.descr, t.type, u.username
      FROM r2db.projects t
      INNER JOIN r2db.users u ON u.user_id=t.user_fk
      WHERE t.user_fk = ${userId} OR project_id in  (select project_fk from r2db.projects_users where user_fk=${userId});
  `) as (Pick<projects, 'project_id' | 'name' | 'color' | 'descr' | 'type'> &
      Pick<users, 'username'>)[];

    return {projects};
  }),

  trpcAppProjectLoad: protectedProcedure
    .input(
      z.object({
        projectId: z.number().int(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {projectId} = input;

      const projects = (await prisma.$queryRaw`
        SELECT DISTINCT t.name, t.color, t.descr, t.type, tu.access_control, u.username
        FROM r2db.projects t
        LEFT OUTER JOIN r2db.projects_users tu on t.project_id = tu.project_fk
        INNER JOIN r2db.users u ON u.user_id=t.user_fk
        WHERE t.project_id=${projectId} AND (t.user_fk = ${userId} OR tu.user_fk = ${userId});
      `) as (Pick<projects, 'name' | 'color' | 'descr' | 'type'> &
        Pick<projects_users, 'access_control'> &
        Pick<users, 'username'>)[];

      const project = projects[0];

      if (!project) {
        return {error: 404, message: 'No data available'};
      }
      const users = (await prisma.$queryRaw`
          select p.user_fk, p.usertype, u.username, u.name, u.user_image_hash, p.access_control
          from (
            SELECT t.user_fk,  1 as access_control, 'owner' as usertype
            FROM r2db.projects t
            WHERE t.project_id=${projectId} AND t.user_fk=${userId}
            UNION
            SELECT tu.user_fk, tu.access_control, 'member' as usertype
            FROM r2db.projects t
            LEFT OUTER JOIN r2db.projects_users tu on t.project_id = tu.project_fk
            WHERE t.project_id=${projectId} AND t.user_fk=${userId}
          ) p 
          inner join r2db.users u on u.user_id = p.user_fk;
        `) as (Pick<projects, 'project_id' | 'user_fk'> & {
        usertype: 'owner' | 'member';
      } & Pick<TableUsers, 'username' | 'name' | 'user_image_hash'> &
        Pick<projects_users, 'access_control'>)[];

      const objects = (await prisma.$queryRaw`
        SELECT o.object_id, o.object_name, m.icon
        FROM r2db.objects o
        inner join r2db.models m on m.model_id=o.model_fk
        WHERE project_fk = ${projectId};
      `) as (Pick<objects, 'object_id' | 'object_name'> &
        Pick<models, 'icon'>)[];

      const widgets = (await prisma.$queryRaw`
        SELECT wb.widget_id, wb.widget_template_fk, wb.name, w.icon_color,
          ${Prisma.raw(`w.descr_${lang}`)} as descr
        FROM r2db.widgets wb
        INNER JOIN r2db.widgets_templates w ON w.widget_template_id=wb.widget_template_fk
        WHERE wb.project_fk =${projectId};
      `) as (Pick<widgets, 'widget_id' | 'widget_template_fk' | 'name'> &
        Pick<widgets_templates, 'icon_color'> & {
          descr: widgets_templates['descr_en'];
        })[];

      return {project, users, objects, widgets};
    }),

  // /////////////////////////////////////////////////////////////////// //

  trpcAppProjectDel: protectedProcedure
    .input(
      z.object({
        projectId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {projectId} = input;
      const {userId, lang} = ctx.session;

      const objects = await prisma.objects.findMany({
        select: {mqtt_client_id: true},
        where: {project_fk: projectId},
      });

      await prisma.$executeRaw`
        DELETE FROM r2db.projects WHERE project_id = ${projectId} and user_fk = ${userId}
      `;
      informObjectsByClientId(objects, userId);
    }),

  trpcAppProjectAdd: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        descr: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {userId, lang} = ctx.session;
      const {name, color, descr} = input;

      await prisma.projects.create({
        data: {
          name,
          color,
          descr,
          user_fk: userId,
        },
      });
    }),

  trpcAppObjectProjectSet: protectedProcedure
    // app.post('/app/object/topics', async (req, res, next) => {
    .input(
      z.object({
        objectId: z.number().int(),
        projectId: z.nullable(z.number().int()),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {objectId, projectId} = input;
      const {userId, lang} = ctx.session;

      await prisma.$executeRaw`
      UPDATE r2db.objects SET project_fk = ${projectId} WHERE user_fk = ${userId} AND object_id = ${objectId}
    `;

      const objects = await prisma.objects.findMany({
        select: {mqtt_client_id: true},
        where: {object_id: objectId},
      });
      informObjectsByClientId(objects, userId);
    }),

  trpcAppWidgetProjectSet: protectedProcedure
    .input(
      z.object({
        widgetId: z.number().int(),
        projectId: z.nullable(z.number().int()),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {widgetId, projectId} = input;
      const {userId, lang} = ctx.session;

      await prisma.$executeRaw`
        UPDATE r2db.widgets SET project_fk = ${projectId} WHERE user_fk = ${userId} AND widget_id = ${widgetId}
      `;
    }),

  trpcAppUserProjectAdd: protectedProcedure
    // app.put('/app/projects/:topic_id/users/attach',async (req, res, next) => {
    .input(
      z.object({
        extUserId: z.number().int(),
        projectId: z.number().int(),
        controlAccess: z.boolean(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {extUserId, projectId, controlAccess} = input;
      const {userId, lang} = ctx.session;
      try {
        await prisma.$executeRaw`
        INSERT INTO r2db.projects_users(project_fk, user_fk, access_control)
        SELECT ${projectId}, ${extUserId}, ${controlAccess} FROM r2db.projects
        WHERE user_fk = ${userId} AND project_id = ${projectId}
      `;

        informObjectsByProject(projectId, userId);

        sendCommandToUser(extUserId, {
          commands: ['reloadObjects', 'reloadProjects'],
          message: 'Added to project',
        });
      } catch (err) {
        console.error(err);
      }
    }),

  trpcAppUserProjectDel: protectedProcedure
    // app.put('/app/projects/:topic_id/users/detach',async (req, res, next) => {
    .input(
      z.object({
        extUserId: z.number().int(),
        projectId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {extUserId, projectId} = input;
      const {userId, lang} = ctx.session;

      await prisma.$executeRaw`
          DELETE tu.* FROM r2db.projects_users tu
          INNER JOIN r2db.projects t ON tu.project_fk=t.project_id
          WHERE tu.project_fk=${projectId} and tu.user_fk=${extUserId} and t.user_fk=${userId};
      `;

      informObjectsByProject(projectId, userId);

      sendCommandToUser(extUserId, {
        commands: ['reloadObjects', 'reloadProjects'],
        message: 'Removed from project',
      });
    }),
});

const informObjectsByProject = async (projectId: number, userId: number) => {
  const objects = await prisma.objects.findMany({
    select: {mqtt_client_id: true},
    where: {project_fk: projectId},
  });
  objects.forEach(({mqtt_client_id}) => {
    sendCommandToObject(mqtt_client_id, {
      command: 'reloadObjectData',
      userId: userId,
    });
    // redisClient.publish(`toObject:${mqtt_client_id}`, 'reload:masterdata');
  });
};

const informObjectsByClientId = async (
  objects: {mqtt_client_id: string}[],
  userId: number,
) => {
  objects.forEach(({mqtt_client_id}) => {
    sendCommandToObject(mqtt_client_id, {
      command: 'reloadObjectData',
      userId: userId,
    });
    // redisClient.publish(`toObject:${mqtt_client_id}`, 'reload:masterdata');
  });
};
