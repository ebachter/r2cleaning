import {z} from 'zod';
import {Prisma, prisma} from '@remrob/mysql';
import {router, protectedProcedure, publicProcedure} from '../middleware';
import {objects, objects_geo, objects_provisions, users} from '@remrob/mysql';
import {getRedisClient} from '@remrob/mysql';

const redisClient = getRedisClient();

export const searchObjectsRouter = router({
  searchObjects: protectedProcedure
    // The input is unknown at this time.
    // A client could have sent us anything
    // so we won't assume a certain data type.
    .input(
      z.object({queryString: z.string().nullable(), available: z.boolean()}),
    )
    .query(async ({ctx, input}) => {
      const userId = ctx.session.userid;
      const {queryString, available} = input;
      const qs = queryString ? parseInt(queryString) : 0;

      const rows = (await prisma.$queryRaw`
        SELECT o.model_fk, m.icon, o.object_id, o.object_name, ST_X(og.geo) as lat, ST_Y(og.geo) as lon, u.username
        FROM r2db.objects o
        inner join r2db.users u on u.user_id = o.user_fk
        inner join r2db.models m on m.model_id = o.model_fk
        LEFT OUTER JOIN r2db.objects_geo og ON og.object_fk = o.object_id
        WHERE 
        ${
          available === true
            ? Prisma.sql`o.live_object_online=1 AND `
            : Prisma.empty
        }
        ${
          queryString !== null
            ? Prisma.sql`
            o.publicly_accessible_data is not null and (o.object_name like ${`%${queryString}%`} OR o.model_fk = ${qs} OR o.object_id = ${qs})`
            : Prisma.sql` o.user_fk=${userId}`
        }
          LIMIT 10
        `) as (Pick<objects, 'model_fk' | 'object_id' | 'object_name'> &
        Pick<users, 'username'> & {icon: string; lat: number; lon: number})[];
      return rows;
    }),

  searchObject: protectedProcedure
    .input(z.number())
    .query(async ({ctx, input}) => {
      const userId = ctx.session.userid;
      const lang = ctx.session.language;
      const objectId = input;

      const object = (await prisma.$queryRaw`
      SELECT
        o.model_fk,
        o.object_name,
        m.icon,
        u.username,
        ${Prisma.raw(`m.json_model_full->>'$.descr.${lang}'`)} as descr,
        o.features,
        o.publicly_accessible_data,
        o.live_object_online
      FROM r2db.objects o
      INNER JOIN r2db.users u on u.user_id = o.user_fk
      INNER JOIN r2db.models m on m.model_id = o.model_fk
      LEFT OUTER JOIN r2db.objects_geo og ON og.object_fk = o.object_id
      WHERE o.publicly_accessible_data is not null and o.object_id=${objectId};
    `) as (Pick<objects, 'model_fk' | 'object_name'> & {
        icon: string;
        username: string;
        descr: string;
        features: string[];
        object_name: string;
        publicly_accessible_data: {
          buttons: string[];
          actors: string[];
          sensors: string[];
        };
        live_object_online: number;
      })[];

      const provisions = (await prisma.$queryRaw`
      SELECT 
        p.slave_mqtt_client_id,
        p.slave_model_fk,
        ${Prisma.raw(`m.json_model_full->>'$.name.${lang}'`)} slave_model_name,
        p.label, 
        IF(o.object_id is null, "false", "true") as registered
      FROM r2db.objects_provisions p
      LEFT OUTER JOIN r2db.objects o ON p.slave_mqtt_client_id=o.mqtt_client_id
      INNER JOIN r2db.models m ON m.model_id = p.slave_model_fk
      WHERE master_object_fk = ${objectId};
    `) as (Pick<
        objects_provisions,
        'slave_mqtt_client_id' | 'slave_model_fk' | 'label'
      > & {
        registered: 'true' | 'false';
        slave_model_name: string;
      })[];

      if (!object[0]) throw new Error('Object is not defined');

      const liveData = await redisClient.hgetall('object:' + objectId);
      const live = liveData as {
        [k: string]: string;
      };
      return {...object[0], provisions, live};
    }),
});
