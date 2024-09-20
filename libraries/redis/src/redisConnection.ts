import Redis from 'ioredis';

let numberOfRedisConnections = 0;

export const getRedisClient = () => {
  const redisClient = new Redis(
    `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  );

  redisClient.on('connect', function () {
    console.info('connected to redis successfully');
    numberOfRedisConnections++;
    console.info({numberOfRedisConnections: numberOfRedisConnections});
  });

  redisClient.on('end', function () {
    console.info('disconnected from redis successfully');
    numberOfRedisConnections--;
    console.info({numberOfRedisConnections: numberOfRedisConnections});
  });

  redisClient.on('error', function (err) {
    console.error(err, 'could not establish a connection with redis');
  });

  return redisClient;
};
