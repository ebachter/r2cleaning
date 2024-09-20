import fastify from 'fastify';
import {setup, register} from '@remrob/shuttle';
import {getTerminator} from '@remrob/t800';

const WEB_ADDR = process.env.WEB_ADDR || '0.0.0.0';
const WEB_PORT = process.env.WEB_PORT ? parseInt(process.env.WEB_PORT) : 3000;

register(async () => {
  // const app = fastify({logger: log});
  const app = fastify();
  const terminator = getTerminator(app.server);

  app.get('/v1/ping', (req, reply) => {
    reply.code(200).send({time: new Date()});
  });

  await app.listen(WEB_PORT, WEB_ADDR);

  return async () => {
    app.log.info('Shutting down HTTP server');
    await terminator();
    app.log.info('HTTP shutdown finished');
  };
});

setup();
