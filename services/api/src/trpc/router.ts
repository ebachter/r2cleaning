import {mergeRouters, publicProcedure, router} from './middleware';
import {extUserAuthRouter} from './routes/trpcExtUserAuth';
import {observable} from '@trpc/server/observable';
import {intRouter} from './routes/trpcInt';

export const tmpRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  // channel: channelRouter,
  post: mergeRouters(extUserAuthRouter, intRouter),

  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 500);
      return () => {
        clearInterval(int);
      };
    });
  }),
});

export const appRouter = mergeRouters(extUserAuthRouter, intRouter);
