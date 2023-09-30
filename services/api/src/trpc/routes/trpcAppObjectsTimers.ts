import {z} from 'zod';
import {prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';

export const appObjectsTimersRouter = router({
  appObjectsTimersLoad: protectedProcedure
    .input(z.number().optional())
    .query(async ({ctx, input: objectId}) => {
      const userId = ctx.session?.userid;

      const timers = await prisma.objects_timers.findMany({
        where: {
          OR: [{user_fk: userId}, {user_fk: 94}],
          // object_fk: objectId,
          ...(objectId && {object_fk: objectId}),
        },
      });

      return {timers};
    }),

  trpcObjectTimerDel: protectedProcedure
    .input(
      z.object({
        objectId: z.number().int(),
        timerId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {objectId, timerId} = input;
      const userId = ctx.session?.userid;
      await prisma.objects_timers.deleteMany({
        where: {
          timer_id: timerId,
          user_fk: userId,
          objects: {
            object_id: objectId,
            user_fk: userId,
          },
        },
      });
    }),

  appObjectTimerAdd: protectedProcedure
    .input(
      z.object({
        objectId: z.number().int(),
        switchId: z.string(),
        stateId: z.string(),
        reactionObjectId: z.number(),
        reactionSwitchId: z.string(),
        reactionTaskId: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {
        objectId,
        switchId,
        stateId,
        reactionObjectId,
        reactionSwitchId,
        reactionTaskId,
      } = input;
      const userId = ctx.session?.userid;

      await prisma.objects_actions_actors.create({
        data: {
          user_fk: userId,
          actor_object_fk: objectId,
          // actor_model_id: objectId,
          actor_switch_id: switchId,
          actor_state_id: stateId,

          reactor_object_fk: reactionObjectId,
          // reactor_model_id: reactionSwitchId,
          reactor_switch_id: reactionSwitchId,
          reactor_task_id: reactionTaskId,
        },
      });
    }),
});
