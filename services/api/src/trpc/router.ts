import {mergeRouters, router} from './middleware';
import {adminRouter} from './routes/trpc.admin';
import {extUserAuthRouter} from './routes/trpcExtUserAuth';
import {intRouter} from './routes/trpcInt';

export const appRouter = router({
  auth: extUserAuthRouter,
  user: intRouter,
  admin: adminRouter,
});
