import {mergeRouters} from './middleware';
import {extUserAuthRouter} from './routes/trpcExtUserAuth';
import {intRouter} from './routes/trpcInt';

export const appRouter = mergeRouters(extUserAuthRouter, intRouter);
