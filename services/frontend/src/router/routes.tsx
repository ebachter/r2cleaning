import {Routes, Route} from 'react-router-dom';
import ScrollToTopScrollToTop from './ScrollTopOnRouteChange';
import {z} from 'zod';
import Home from '../pages/external/intro/index';
import Login from '../pages/external/login';
import Objects from '../pages/internalApp/objects';
import ObjectPage from '../pages/internalApp/object';
import ObjectsActions from '../pages/internalApp/objectActions';
import ObjectsTimers from '../pages/internalApp/objectTimers';
import ObjectsAlerts from '../pages/internalApp/objectAlerts';
import Settings from '../pages/internalSettings/settingsMenuPage';
import SettingsUser from '../pages/internalSettings/user';
import SettingsAccount from '../pages/internalSettings/account';
import SettingsBilling from '../pages/internalSettings/billing';
import Widgets from '../pages/internalApp/widgets';
import Widget from '../pages/internalApp/widget';
import WidgetInfo from '../pages/internalApp/widgetSettings';
import Projects from '../pages/internalApp/projects';
import Project from '../pages/internalApp/project';
import ProjectChat from '../pages/internalApp/projectChat';
import Timeline from '../pages/internalApp/timeline';
import Services from '../pages/internalApp/services';
import Service from '../pages/internalApp/service';
import Signup from '../pages/external/signup';
import SignupConfirm from '../pages/external/signupConfirm';
import AboutPage from '../pages/external/about';
import Features from '../pages/external/order';
import Contact from '../pages/external/contact';
import Reset from '../pages/external/reset';
import ResetConfirm from '../pages/external/resetConfirm';
import NotFound from '../pages/NotFound';
import {ReactNode} from 'react';

export const allRouterParamsSchema = z.object({
  objectId: z.coerce.number(),
  projectId: z.coerce.number(),
  widgetId: z.coerce.number(),
  serviceId: z.coerce.number(),
  modelId: z.coerce.number(),
  stype: z.coerce.string(),
  username: z.coerce.string(),
  contractId: z.coerce.number(),
  serviceTemplateId: z.coerce.number(),
  signupId: z.coerce.string(),
  resetId: z.coerce.string(),
});

export type AllRouterParams = z.infer<typeof allRouterParamsSchema>;

export type RouteObject = {
  element: ReactNode;
  breadcrumbs?: {
    crumbs: (params?: AllRouterParams) => (string | null)[];
    parent: (params?: AllRouterParams) => (string | null)[];
  };
};

export type AllRoutesObject = {
  [path: string]: RouteObject;
};

const allRoutesObject = {
  '/': {element: <Home />},
  '/login': {element: <Login />},
  '/signup': {element: <Signup />},
  '/signup/:signupId': {element: <SignupConfirm />},
  '/about': {element: <AboutPage />},
  '/order': {element: <Features />},
  '/contact': {element: <Contact />},
  '/reset': {element: <Reset />},
  '/reset/:resetId': {element: <ResetConfirm />},
  '/objects': {
    element: <Objects />,
    breadcrumbs: {
      crumbs: () => ['Objects'],
      parent: () => [null],
    },
  },
  '/objects/activate': {
    element: <Objects />,
    breadcrumbs: {
      crumbs: () => ['Objects'],
      parent: () => [null],
    },
  },
  '/objects/register': {element: <Objects />},
  '/objects/:objectId': {
    element: <ObjectPage />,
    breadcrumbs: {
      crumbs: (params) => ['Objects', `Object ${params?.objectId}`],
      parent: () => ['/objects'],
    },
  },
  '/objects/:objectId/timers': {
    element: <ObjectsTimers />,
    breadcrumbs: {
      crumbs: (params) => ['Objects', `Object ${params?.objectId}`, 'Timers'],
      parent: (params) => ['/objects', `/objects/${params?.objectId}`],
    },
  },
  '/objects/:objectId/actions': {
    element: <ObjectsActions />,
    breadcrumbs: {
      crumbs: (params) => ['Objects', `Object ${params?.objectId}`, 'Actions'],
      parent: (params) => ['/objects', `/objects/${params?.objectId}`],
    },
  },
  '/objects/:objectId/alerts': {
    element: <ObjectsAlerts />,
    breadcrumbs: {
      crumbs: (params) => ['Objects', `Object ${params?.objectId}`, 'Alerts'],
      parent: (params) => ['/objects', `/objects/${params?.objectId}`],
    },
  },
  '/widgets': {
    element: <Widgets />,
    breadcrumbs: {
      crumbs: () => ['Widgets'],
      parent: () => [null],
    },
  },
  '/widgets/:widgetId': {
    element: <Widget />,
    breadcrumbs: {
      crumbs: (params) => ['Widgets', `Widget ${params?.widgetId}`],
      parent: () => ['/widgets'],
    },
  },
  '/widgets/:widgetId/settings': {
    element: <WidgetInfo />,
    breadcrumbs: {
      crumbs: (params) => ['Widgets', `Widget ${params?.widgetId}`, 'Settings'],
      parent: (params) => ['/widgets', `/widgets/${params?.widgetId}`],
    },
  },
  '/projects': {
    element: <Projects />,
    breadcrumbs: {
      crumbs: () => ['Projects'],
      parent: () => [null],
    },
  },
  '/projects/:projectId': {
    element: <Project />,
    breadcrumbs: {
      crumbs: (params) => [`Projects`, `Project ${params?.projectId}`],
      parent: () => ['/projects', null],
    },
  },
  '/projects/:projectId/chat': {
    element: <ProjectChat />,
    breadcrumbs: {
      crumbs: (params) => [`Projects`, `Chat ${params?.projectId}`],
      parent: () => ['/projects', null],
    },
  },
  '/services': {
    element: <Services />,
    breadcrumbs: {
      crumbs: () => ['Services'],
      parent: () => [null],
    },
  },
  '/services/:serviceId': {
    element: <Service />,
    breadcrumbs: {
      crumbs: (params) => ['Services', `Service ${params?.serviceId}`],
      parent: () => ['/services', null],
    },
  },
  '/timeline': {
    element: <Timeline />,
    breadcrumbs: {
      crumbs: () => ['Timeline'],
      parent: () => [null],
    },
  },
  '/settings': {
    element: <Settings />,
    breadcrumbs: {
      crumbs: () => ['Settings'],
      parent: () => [null],
    },
  },
  '/settings/user': {
    element: <SettingsUser />,
    breadcrumbs: {
      crumbs: () => ['Settings', 'User'],
      parent: () => ['/settings', null],
    },
  },
  '/settings/account': {
    element: <SettingsAccount />,
    breadcrumbs: {
      crumbs: () => ['Settings', 'Account'],
      parent: () => ['/settings', null],
    },
  },
  '/settings/billing': {
    element: <SettingsBilling />,
    breadcrumbs: {
      crumbs: () => ['Settings', 'Billing'],
      parent: () => ['/settings', null],
    },
  },
  /* '/search/:stype': {
    element: <Search />,
    breadcrumbs: {
      crumbs: (params) => [`Search ${params?.stype}`],
      parent: () => ['/objects'],
    },
  }, */
} satisfies AllRoutesObject;

export type AllRoutesObjectType = typeof allRoutesObject;

export const allRoutesArray = Object.entries(
  allRoutesObject as AllRoutesObject,
).map(([route, {breadcrumbs}]) => ({
  path: route,
  crumbs: breadcrumbs?.crumbs,
  parent: breadcrumbs?.parent,
}));

const Main = () => {
  return (
    <>
      <ScrollToTopScrollToTop />
      <Routes>
        {Object.entries(allRoutesObject).map(([path, data], i) => (
          <Route path={path} element={data.element} key={i} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Main;
