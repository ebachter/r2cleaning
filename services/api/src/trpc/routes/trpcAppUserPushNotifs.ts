import {z} from 'zod';
import {isJsonString} from '@remrob/utils';
import {getRedisClient} from '@remrob/mysql';
import {router, protectedProcedure} from '../middleware';
// import type {TypeUser} from '@remrob/utils';
import webPush from 'web-push';

const redisCon = getRedisClient();

export const trpcAppUserPushNotifsRouter = router({
  registerSubscriptionSaga: protectedProcedure
    .input(
      z.object({
        subscription: z.any(),
        endpoint: z.string(),
        key: z.string(),
        authSecret: z.string(),
        fingerprint: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {subscription, endpoint, key, authSecret, fingerprint} = input;
      const userId = ctx.session?.userid;
      const machineId = endpoint.split('/').pop();
      /* await connection.query(`UPDATE r2db.users SET clients = json_set(clients, ?, ?) where userid = ?`,
    [`$."${req.body.fingerprint}"`, JSON.stringify(req.body.subscription), res.locals.userid]);

    console.log('vapid', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)

    // trpc.sendPushNotification
    webPush.sendNotification(req.body.subscription)
    .then(function() {
      console.log('Push Application Server - Notification sent to ' + req.body.subscription.endpoint);
      res.status(204).end();
    }).catch(function() {
      console.log('ERROR in sending Notification, endpoint removed ' + req.body.subscription.endpoint);
      res.status(501).end();
    });*/
      redisCon
        .multi()
        // .select(0)
        .setnx(
          `client:${machineId}`,
          JSON.stringify({
            endpoint,
            key,
            authSecret,
            user: userId,
            //subscription,
          }),
        )
        .sadd(`usersubs:${userId}`, `client:${machineId}`);
      return {status: 204};
    }),

  removeSubscriptionSaga: protectedProcedure
    .input(
      z.object({
        endpoint: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {endpoint} = input;
      const userId = ctx.session?.userid;

      const machineId = endpoint.split('/').pop();
      if (!machineId || !endpoint) {
        return {
          status: 400,
          message:
            'unRegisterUserClient vars machineId or endpoint is undefined',
        };
      }
      // log.info('---user ', 'usersubs:', user, '---machineId ', machineId, '---endpoint ', endpoint);
      redisCon
        .multi()
        .select(0)
        .srem(`usersubs:${userId}`, `client:${machineId}`)
        .del(`client:${machineId}`)
        // .del('payload:' + decodeURIComponent(machineId));
        .exec((err) => {
          if (err) {
            return {status: 400, message: 'err within unRegisterUserClient'};
          }
          return {status: 204};
        });
    }),

  loadSubscriptionStatusSaga: protectedProcedure
    .input(
      z.object({
        endpoint: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {endpoint} = input;
      const userId = ctx.session?.userid;
      const machineId = endpoint.split('/').pop();

      if (!machineId) {
        return {status: 400, message: 'getSubscriptionStatus vars undefined'};
      }
      try {
        const res = (await redisCon
          .multi()
          .select(0)
          // .exists('usersubs:'+user);
          .sismember(`usersubs:${userId}`, `client:${machineId}`)
          // .del('payload:' + decodeURIComponent(machineId));
          .exec()) as [error: Error | null, result: boolean][] | null;
        return {status: 204, subscriptionStatus: res?.[1]};
      } catch (err) {
        return {status: 400, message: err};
      }
    }),

  sendPushNotification: protectedProcedure
    .input(
      z.object({
        subscription: z.string(),
        payload: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {subscription, payload} = input;
      const userId = ctx.session?.userid;

      const object = JSON.parse(subscription);
      const endpoint = object.endpoint;
      const key = object.key;
      const authSecret = object.authSecret;

      webPush
        .sendNotification(endpoint, payload || '', {
          TTL: 1000,
          // userPublicKey: key,
          // payload: payload || '',
          // userAuth: authSecret || '',
        })
        .then((res) => {
          return {
            status: 200,
            result: res,
            message: 'Push Notification sucessfully sent to FF/Chrome',
          };
        })
        .catch((err) => {
          if (err.statusCode === 410) {
            // log.info('------statusCode------', err.statusCode);
            const machineId = endpoint.split('/').pop();
            redisCon
              .multi()
              .select(0)
              .get(`client:${machineId}`)
              .exec((err, res) => {
                if (err) {
                  return {
                    status: 400,
                    message: 'err within registerUserClient',
                    error: err,
                  };
                }
                if (typeof res?.[1] !== 'string' || !isJsonString(res?.[1])) {
                  return {
                    status: 400,
                    message: 'push data is not defined',
                    error: err,
                  };
                }
                const obj = JSON.parse(res[1]);
                redisCon
                  .multi()
                  .del(`client:${machineId}`)
                  .srem(`usersubs:${obj.user}`, `client:${machineId}`)
                  .exec((err3) => {
                    return {
                      status: 400,
                      message: 'notification srem error',
                      error: err3,
                    };
                    // log.info('deactivate user ', obj.user);
                  });
              });
          } else {
            return {
              status: 400,
              message: 'ERROR in sending Notification, send to DB ',
              endpoint,
            };
          }
          // subscriptions.splice(subscriptions.indexOf(endpoint), 1);
        });

      return {status: 204};
    }),
});
