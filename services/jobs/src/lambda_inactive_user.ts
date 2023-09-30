import log from '@remrob/log';
import redis from 'redis';
import {prisma, Prisma} from '@remrob/mysql';

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = parseInt(process.env.REDIS_PORT as string);

const redis_client = redis.createClient(REDIS_PORT, REDIS_HOST);

export const handler = async () => {
  const minutes = 60 * 5;
  try {
    await prisma.$transaction(
      async (tx) => {
        log.trace('inactive ta start');
        const sql = `
          SELECT
            user_fk
            # , max(last_connected_at) last_connected_at
            # , max(last_disconnected_at) last_disconnected_at #,ua.*
            # , COUNT(IF(last_disconnected_at is null,1, null))
            # , TIMESTAMPDIFF(MINUTE, max(last_disconnected_at), now())
          FROM r2db.users_activity ua
          WHERE ua.user_fk IN (
            SELECT user_id FROM r2db.users 
            WHERE user_active = 1 AND plan = 'basic' AND services_amount = 0
          )
          GROUP BY ua.user_fk
          HAVING COUNT(IF(ua.last_disconnected_at is null,1, null))=0 
            AND TIMESTAMPDIFF(MINUTE, max(ua.last_disconnected_at), now()) > ${minutes}
        
        `;

        // 1. FIND & BLOCK THE INACTIVE USERs. EXCLUDE USERS with BASIC PLAN
        /* await conn.query(`
          ${sql}
          FOR UPDATE;
        `);*/

        // 2. MARK THE USERS AS INACTIVE
        await tx.$executeRaw`
          WITH temp AS (
            ${Prisma.sql`${Prisma.raw(sql)}`}
          )
          UPDATE r2db.users SET user_active = 0
          WHERE user_id in (select user_fk from temp);
        `;

        // 3. DISCONNECT OBJECTS
        const objects: [] = await tx.$queryRaw`
          SELECT
            o.object_id,
            o.user_fk
          FROM r2db.objects o
          WHERE o.user_fk IN (
            ${Prisma.sql`${sql}`}
          );
        `;

        objects.forEach((obj: any) => {
          redis_client.publish(
            `toObject:${obj.object_id}`,
            JSON.stringify({event: 'disconnect_owner_inactive'}),
          );
        });
        log.trace('inactive ta end');
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, // optional, default defined by database configuration
      },
    );
  } catch (err) {
    log.error(err, 'lambda_inactive_users');
    // await prisma.$disconnect();
  }
};
