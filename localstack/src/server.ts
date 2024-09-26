import fastify from 'fastify';

const WEB_ADDR = Bun.env.WEB_ADDR || '0.0.0.0';
const WEB_PORT = Bun.env.WEB_PORT ? parseInt(Bun.env.WEB_PORT) : 3000;

// const app = fastify({logger: log});
const app = fastify();

app.get('/v1/ping', (req, reply) => {
  reply.code(200).send({time: new Date()});
});

app.listen(WEB_PORT, WEB_ADDR);
