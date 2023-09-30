import Redis from 'ioredis';
import log from '@remrob/log';

let numberOfRedisConnections = 0;

export const getRedisClient = () => {
  const redisClient = new Redis(
    `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  );

  redisClient.on('connect', function () {
    log.info('connected to redis successfully');
    numberOfRedisConnections++;
    log.info({numberOfRedisConnections: numberOfRedisConnections});
  });

  redisClient.on('end', function () {
    log.info('disconnected from redis successfully');
    numberOfRedisConnections--;
    log.info({numberOfRedisConnections: numberOfRedisConnections});
  });

  redisClient.on('error', function (err) {
    log.error(err, 'could not establish a connection with redis');
  });

  return redisClient;
};
