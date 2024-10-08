import {router} from './middleware';
import {adminRouter} from './routes/trpc.admin';
import {extUserAuthRouter} from './routes/trpc.auth';
import {intRouter} from './routes/trpc.user';

export const appRouter = router({
  auth: extUserAuthRouter,
  user: intRouter,
  admin: adminRouter,
});
