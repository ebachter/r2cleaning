import {prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';

export const appTimelineRouter = router({
  appTimelineLoad: protectedProcedure.query(async ({ctx}) => {
    const {userId} = ctx.session;

    const timeline = await prisma.log_timeline.findMany({
      select: {
        timeline_id: true,
        operation: true,
        data: true,
        created_at: true,
      },
      where: {
        user_fk: userId,
      },
    });

    return timeline;
  }),
});
