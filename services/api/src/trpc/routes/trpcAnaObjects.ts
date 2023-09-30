import {prisma} from '@remrob/mysql';
import {TableObjects} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';

export const anaObjectsRouter = router({
  anaObjectAlertsLoad: protectedProcedure.query(async ({ctx}) => {
    const {userId, lang} = ctx.session;

    const object = (await prisma.objects.findMany({
      select: {
        object_id: true,
        alerts: true,
        models: {select: {json_model_full: true}},
      },
      where: {
        OR: [{user_fk: userId}, {projects: {user_fk: userId}}],
      },
    })) as unknown;

    return object as {
      object_id: number;
      alerts: TableObjects['alerts'];
      // models: {json_model_full: TableModels['json_model_full']};
    }[];
  }),
});
