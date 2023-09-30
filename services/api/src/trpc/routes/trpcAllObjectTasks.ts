import {date, z} from 'zod';
import {prisma, sendCommandToObject} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';

export const allObjectTasksRouter = router({
  reConnectObject: protectedProcedure
    .input(
      z.object({
        mqttClientId: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {mqttClientId} = input;
      const userId = ctx.session?.userid;

      sendCommandToObject(mqttClientId, {
        command: 'reConnect',
        userId: userId,
      });
      /* redisClient.publish(
        `toObject:${mqttClientId}`,
        JSON.stringify({event: 'reConnect', user: userId}),
      ); */
    }),

  loadCloudData: protectedProcedure
    .input(
      z.object({
        objectId: z.number().int(),
        cloudKey: z.string(),
        from: z.date(),
        to: date(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {objectId, cloudKey, from, to} = input;
      const userId = ctx.session?.userid;

      // const data = await getCloudData(parseInt(instnc.userid), arr); //.then((data) => {
      const data = (await prisma.$queryRaw`
        SELECT value, created as date
        FROM r2data.cloudStore
        WHERE user=${userId} and object=${objectId} and datastore=${cloudKey} and created_iso between ${from} and ${to}`) as {
        value: string;
        created: Date;
      }[];

      return {
        data: data,
        objectid: objectId,
        cloudkey: cloudKey,
        oper: 'loadCloudData',
      };
    }),

  getSensorLogData: protectedProcedure
    .input(
      z.object({
        objectId: z.number().int(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {objectId} = input;
      const userId = ctx.session?.userid;

      const data = (await prisma.$queryRaw`
      SELECT sensorid, value, insertedAt
      FROM r2data.objects_log_sensors
      WHERE userid=${userId} and objectid=${objectId}`) as {
        sensorid: string;
        value: number;
        insertedAt: Date;
      }[];

      return JSON.stringify({oper: 'getSensorLogData', data, objectId});
    }),

  sendObjectSwitchTask: protectedProcedure
    .input(
      z.object({
        // objectId: z.number().int(),
        mqttClientId: z.string(),
        switchId: z.string(),
        taskId: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {mqttClientId, switchId, taskId} = input;
      const userId = ctx.session?.userid;

      sendCommandToObject(mqttClientId, {
        command: 'updateSwitch',
        userId,
        switchId,
        taskId,
      });
      /* redisClient.publish(
        `toObject:${mqttClientId}`,
        JSON.stringify({
          actorid: switchId,
          taskid: taskId,
        }),
      ); */
    }),

  sendObjectButtonTask: protectedProcedure
    .input(
      z.object({
        objectId: z.number().int(),
        mqttClientId: z.string(),
        buttonId: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {mqttClientId, buttonId} = input;
      const userId = ctx.session?.userid;

      sendCommandToObject(mqttClientId, {
        command: 'updateButton',
        userId,
        buttonId,
      });
      /* redisClient.publish(
        `toObject:${mqttClientId}`,
        JSON.stringify({
          buttonid: buttonId,
        }),
      ); */
    }),
});
