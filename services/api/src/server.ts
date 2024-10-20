import express from 'express';
import {createServer} from 'http';
import bearerToken from 'express-bearer-token';
import helmet from 'helmet';
import cors from 'cors';
import {appRouter} from './trpc/router';
import {createContext} from './trpc/context';
import {checkRoute} from './functions/authCheckRoute';
import {inferReactQueryProcedureOptions} from '@trpc/react-query';
import {inferRouterInputs, inferRouterOutputs} from '@trpc/server';
import fs from 'node:fs';
import healthcheck from './healthcheck';
import ws from 'ws';
import {applyWSSHandler} from '@trpc/server/adapters/ws';
import {createHTTPServer} from '@trpc/server/adapters/standalone';

export type AppRouter = typeof appRouter;

// infer the types for your router
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const WEB_ADDR = '0.0.0.0';
const WEB_PORT = parseInt(Bun.env.REACT_APP_API_PORT!);

// let serverParams = {};
/* if (Bun.env.NODE_ENV !== 'development') {
  const sslPath = '/etc/ssl/private/api.cleaning.remrob.com/';
  try {
    const privateKey = fs.readFileSync(`${sslPath}privkey1.pem`, 'utf8');
    const certificate = fs.readFileSync(`${sslPath}cert1.pem`, 'utf8');
    // const ca = fs.readFileSync(`${sslPath}chain1.pem`, 'utf8');

    serverParams = {
      ...serverParams,
      key: privateKey,
      cert: certificate,
      // ca: ca,
    };
  } catch (e) {
    console.log(e);
  }
} */

/* const app = express();
const httpServer = createServer(serverParams, app);

app.use(helmet());

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', parameterLimit: 1500}));

app.use(healthcheck);

// Disable caching (304 responses)
app.set('etag', false);

app.use(bearerToken());
app.use(
  cors({
    origin: '*', // [`${Bun.env.FRONTEND_ORIGIN}`, `${Bun.env.ORIGIN_EXPO}`],
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
); */

// Routes Without Login Check
// import util from 'util';
// const router = express.Router();
// app.use('/api', router);

// router.use(await import('./functions/authCheckRoute').checkRoute);
// router.use(checkRoute);

// router.get('/session/valid', (req, res) => {
//  res.status(200).end();
// });

/* ************** PROTECTED *************** */
/* const listener = httpServer.listen(WEB_PORT, WEB_ADDR, () => {
  console.info(`API server listening on ${WEB_ADDR}:${WEB_PORT}`);
}); */

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});

const wss = new ws.Server({server});

const handler = applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext,
  keepAlive: {
    enabled: true,
    // server ping message interval in milliseconds
    pingMs: 30000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
});

server.listen(WEB_PORT, WEB_ADDR, () => {
  console.info(`API server listening on ${WEB_ADDR}:${WEB_PORT}`);
});

wss.on('connection', (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
// console.log('✅ WebSocket Server listening on ws://localhost:3001');

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
