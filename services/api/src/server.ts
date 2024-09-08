import log from '@remrob/log';
import {getTerminator} from '@remrob/t800';
import {register, setup} from '@remrob/shuttle';
import '@remrob/aws';
import '@remrob/utils';
import '@remrob/redis';
import express from 'express';
import {createServer} from 'http';
import bearerToken from 'express-bearer-token';
import helmet from 'helmet';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import {appRouter} from './trpc/router';
import {createContext} from './trpc/context';
import {checkRoute} from './functions/authCheckRoute';
import {inferReactQueryProcedureOptions} from '@trpc/react-query';
import {inferRouterInputs, inferRouterOutputs} from '@trpc/server';

export type AppRouter = typeof appRouter;

// infer the types for your router
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const WEB_ADDR = '0.0.0.0';
const WEB_PORT = parseInt(process.env.REACT_APP_API_PORT!);

register(async () => {
  const app = express();
  const httpServer = createServer(app);

  app.use(helmet());

  app.use(express.json({limit: '25mb'}));
  app.use(express.urlencoded({limit: '25mb', parameterLimit: 1500}));

  app.use((await import('./healthcheck')).default);

  // Disable caching (304 responses)
  app.set('etag', false);

  app.use(bearerToken());
  app.use(
    cors({
      origin: '*', // [`${process.env.FRONTEND_ORIGIN}`, `${process.env.ORIGIN_EXPO}`],
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
  );

  // Routes Without Login Check
  // import util from 'util';
  const router = express.Router();
  app.use('/api', router);

  // router.use(await import('./functions/authCheckRoute').checkRoute);
  router.use(checkRoute);

  router.get('/session/valid', (req, res) => {
    res.status(200).end();
  });

  /* ************** PROTECTED *************** */
  const listener = httpServer.listen(WEB_PORT, WEB_ADDR, () => {
    log.info(`API server listening on ${WEB_ADDR}:${WEB_PORT}`);
  });

  const terminator = getTerminator(listener);

  return async () => {
    log.info('Shutting down HTTP server');
    await terminator();
    log.info('HTTP shutdown finished');
  };
});

// Setup server
setup(); // .catch((err) => log.error(err, 'app init failed'));
