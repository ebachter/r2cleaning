import {router} from './middleware';
import {adminRouter} from './routes/trpc.admin';
import {extUserAuthRouter} from './routes/trpc.auth';
import {channelRouter} from './routes/trpc.channel';
import {masterdataRouter} from './routes/trpc.master';
import {supplierRouter} from './routes/trpc.supplier';
import {intRouter} from './routes/trpc.user';

export const appRouter = router({
  auth: extUserAuthRouter,
  user: intRouter,
  admin: adminRouter,
  supplier: supplierRouter,
  master: masterdataRouter,
  channel: channelRouter,
});
