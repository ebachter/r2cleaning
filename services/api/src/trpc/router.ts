import {mergeRouters} from './middleware';
import {trpcAppServicesRouter} from './routes/trpcAppServices';
import {trpcProServicesRouter} from './routes/trpcProServices';
import {widgetsRouter} from './routes/trpcProWidgets';
import {anaProvisionsRouter} from './routes/trpcAnaProvisions';
import {proModelsRouter} from './routes/trpcProModels';
import {appObjectsRouter} from './routes/trpcAppObjects';
import {appObjectsActionsRouter} from './routes/trpcAppObjectsActions';
import {appObjectsTimersRouter} from './routes/trpcAppObjectsTimers';
import {appProjectChatRouter} from './routes/trpcAppProjectsChats';
import {allObjectTasksRouter} from './routes/trpcAllObjectTasks';
import {appObjectRegistrationRouter} from './routes/trpcAppObjectRegister';
import {searchObjectsRouter} from './routes/trpcSearchObjects';
import {searchUsersRouter} from './routes/trpcMarUsers';
import {searchServicesRouter} from './routes/trpcSearchServices';
import {searchWidgetsRouter} from './routes/trpcSearchWidgets';
import {searchModelsRouter} from './routes/trpcSearchModels';
import {extUserAuthRouter} from './routes/trpcExtUserAuth';
import {appWidgetsRouter} from './routes/trpcAppWidgets';
import {trpcAppUserRouter} from './routes/trpcAppUser';
import {trpcAppProjectsRouter} from './routes/trpcProjects';
import {trpcAppUserPushNotifsRouter} from './routes/trpcAppUserPushNotifs';
import {trpcProModelsSettingsRouter} from './routes/trpcProModelsSettings';
import {trpcProModelsMappinsRouter} from './routes/trpcProModelsMappings';
import {trpcAppObjectsAlertsRouter} from './routes/trpcAppObjectsAlerts';
import {appContactsRouter} from './routes/trpcAppContacts';
import {anaObjectsRouter} from './routes/trpcAnaObjects';
import {appTimelineRouter} from './routes/trpcAppTimeline';

export const appRouter = mergeRouters(
  widgetsRouter,
  trpcAppServicesRouter,
  trpcProServicesRouter,
  anaProvisionsRouter,
  proModelsRouter,
  appObjectsRouter,
  appObjectsActionsRouter,
  appObjectsTimersRouter,
  appObjectRegistrationRouter,
  appProjectChatRouter,
  allObjectTasksRouter,
  searchObjectsRouter,
  searchUsersRouter,
  searchServicesRouter,
  searchWidgetsRouter,
  searchModelsRouter,
  extUserAuthRouter,
  appWidgetsRouter,
  trpcAppUserRouter,
  trpcAppProjectsRouter,
  trpcAppUserPushNotifsRouter,
  trpcProModelsSettingsRouter,
  trpcProModelsMappinsRouter,
  trpcAppObjectsAlertsRouter,
  appContactsRouter,
  anaObjectsRouter,
  appTimelineRouter,
);
