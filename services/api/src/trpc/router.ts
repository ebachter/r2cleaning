import {mergeRouters} from './middleware';
import {adminRouter} from './routes/trpc.admin';
import {extUserAuthRouter} from './routes/trpcExtUserAuth';
import {intRouter} from './routes/trpcInt';

export const appRouter = mergeRouters(
  extUserAuthRouter,
  intRouter,
  adminRouter,
);
