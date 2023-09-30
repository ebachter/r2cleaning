import log from '@remrob/log';
import {getRedisClient} from '@remrob/mysql';

export const setGrid = async (
  user: number,
  actorID: string,
  reactorID: string,
) => {
  const redisCon = getRedisClient();

  const actor = actorID.split(':');
  const reactor = reactorID.split(':');
  if (!user || actor.length < 3 || reactor.length < 3) {
    log.error('vars error setGrid');
    return;
  }
  const prms = await redisCon
    .multi()
    .sadd(`SG:${actorID}`, reactorID)
    // .sadd('SG: USR:'+req.session.user, req.body.d+':'+req.body.u+'-'+req.body.tsk);
    .hset(
      `SG:OBJ:${reactor[0]}:${user}`,
      actorID,
      `${reactor[1]}:${reactor[2]}`,
    )
    .exec();
  return prms;
};

export const delGrid = async (
  user: number,
  actorID: string,
  reactorID: string,
) => {
  const redisCon = getRedisClient();
  const actor = actorID.split(':');
  const reactor = reactorID.split(':');
  if (actor.length < 3 || reactor.length < 3) {
    log.error('vars error delGrid');
    return;
  }
  const prms = await redisCon
    .multi()
    .srem(`SG:${actorID}`, reactorID)
    .hdel(`SG:OBJ:${reactor[0]}:${user}`, actorID)
    .exec();
  return prms;
};

export const getGrids = async (user: number, sid: string) => {
  const redisCon = getRedisClient();

  const prms = await redisCon.hgetall(`SG:OBJ:${sid}:${user}`);

  return prms;
};
