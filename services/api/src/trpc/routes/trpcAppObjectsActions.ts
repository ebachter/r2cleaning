import {z} from 'zod';
import {prisma} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';

export const appObjectsActionsRouter = router({
  appObjectsActionsLoad: protectedProcedure
    .input(z.number().optional())
    .query(async ({ctx, input: objectId}) => {
      const userId = ctx.session?.userid;

      const sensorActions = await prisma.objects_actions_sensors.findMany({
        where: {
          user_fk: userId,
          // object_fk: objectId,
          ...(objectId && {object_fk: objectId}),
        },
      });

      const switchActions = await prisma.objects_actions_actors.findMany({
        where: {
          user_fk: userId,
          // OR: [{actorObjectid: objectId}, {reactorObjectid: objectId}],
          ...(objectId && {
            OR: [{actor_object_fk: objectId}, {reactor_object_fk: objectId}],
          }),
        },
      });

      return {sensorActions, switchActions};
    }),

  trpcObjectActionsSwitchDel: protectedProcedure
    .input(
      z.object({
        objectActionSwitchId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {objectActionSwitchId} = input;
      const userId = ctx.session?.userid;

      await prisma.$executeRaw`
        DELETE FROM r2db.objects_actions_actors
        WHERE user_fk = ${userId} and object_action_switch_id = ${objectActionSwitchId}
      `;
    }),

  appObjectActionSwitchAdd: protectedProcedure
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

  appObjectActionSensorAdd: protectedProcedure
    .input(
      z.object({
        objectId: z.number().int(),
        sensorId: z.string(),
        sign: z.enum(['greater', 'less']),
        value: z.number(),
        actionObjectId: z.number(),
        actionSwitchId: z.string(),
        actionTaskId: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {
        objectId,
        sensorId,
        sign,
        value,
        actionObjectId,
        actionSwitchId,
        actionTaskId,
      } = input;
      const userId = ctx.session?.userid;

      await prisma.objects_actions_sensors.create({
        data: {
          user_fk: userId,
          object_fk: objectId,
          sensor_id: sensorId,
          sign,
          value,
          action_object_fk: actionObjectId,
          action_actor_id: actionSwitchId,
          action_task_id: actionTaskId,
        },
      });
    }),

  appObjectActionSensorDel: protectedProcedure
    .input(
      z.object({
        objectId: z.number().int(),
        sensorActionId: z.number().int(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {objectId, sensorActionId} = input;
      const userId = ctx.session?.userid;

      await prisma.objects_actions_sensors.deleteMany({
        where: {
          user_fk: userId,
          object_fk: objectId,
          object_action_sensor_id: sensorActionId,
        },
      });
    }),
});
