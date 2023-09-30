import {userClear, userSet} from '../redux/sliceUser';
import {getAppState, store} from '../redux/store';
import {trpcFunc} from '../trpc';
import {sessionSet} from '../redux/sliceSession';
import {projectsClear, projectsSet} from '../redux/sliceProjects';
import {widgetsClear, widgetSet} from '../redux/sliceWidgets';
import {objectsClear, objectSet} from '../redux/sliceObjects';
import {contactsClear, contactSet} from '../redux/sliceContacts';
import {serviceSet, servicesClear} from '../redux/sliceServices';

export async function callProjectsLoad() {
  const {dispatch} = store;
  const data = await trpcFunc.trpcAppProjectsLoad.query();
  dispatch(projectsClear());
  const {projects} = data;
  projects.forEach(({project_id, ...rest}) => {
    dispatch(
      projectsSet({
        projectId: project_id,
        projectData: {
          ...rest,
        },
      }),
    );
  });
}

export async function callUserDataLoad() {
  const {dispatch} = store;
  const data = await trpcFunc.trpcAppUserDataLoad.query();
  dispatch(userClear());
  dispatch(userSet(data));
}

export const callAppServicesLoad = async (): Promise<void> => {
  const services = await trpcFunc.appGetServices.query();
  store.dispatch(servicesClear());
  services.forEach((o) => {
    store.dispatch(serviceSet({serviceId: o.service_id, serviceData: o}));
  });
};

export async function callRefreshToken() {
  const refreshTokenOld = getAppState().session.refreshToken as string;

  const {sessionToken, refreshToken} =
    await trpcFunc.trpcAppSessionTokenRefresh.mutate({
      refreshToken: refreshTokenOld,
    });

  sessionSet({sessionToken, refreshToken});
}

export const callAppWidgetsLoad = async (): Promise<void> => {
  const data = await trpcFunc.appLoadWidgets.query();

  store.dispatch(widgetsClear());
  (data?.bookmarks || []).forEach((o) => {
    const models = (data?.models || [])
      .filter((m) => m.widget_template_fk === o?.widget_template_id)
      .map((m) => ({
        modelid: m.model_fk,
        name: m.name,
        icon: m.icon,
      }));

    store.dispatch(
      widgetSet({
        widgetId: o.widget_id,
        widgetData: {
          widgetTemplateId: o.widget_template_id,
          userId: o.user_fk,
          iconColor: o.icon_color,
          creatorId: o.creatorid,
          name: o.name,
          descr: o.descr,
          project: o.project_fk
            ? {
                projectId: o.project_fk,
                projectName: o.project_name,
                projectColor: o.project_color,
              }
            : null,
          objectsOfModels: models,
          privateObjects: [],
        },
      }),
    );
  });
};

export async function callAppObjectsLoad() {
  const data = await trpcFunc.trpcAppLoadObjects.query();
  const dispatch = store.dispatch;
  dispatch(objectsClear());

  data.objects.forEach((o) => {
    // const livaData = data.live?.[o.object_id] || dataInitialObjectLive;
    // _.defaultsDeep(livaData, dataInitialObjectLive);
    const {object_id, ...rest} = o;

    dispatch(
      objectSet({
        objectId: o.object_id,
        objectData: rest,
      }),
    );
  });
}

export async function appContactsLoad() {
  const {dispatch} = store;
  const data = await trpcFunc.appContactsLoad.query();
  dispatch(contactsClear());
  data.forEach(({user_fk, ...o}) => {
    dispatch(contactSet({userId: user_fk, contactData: o}));
  });
}
