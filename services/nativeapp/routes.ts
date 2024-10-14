import ScreenOrderDetails from './screens/Order';
import ScreenObjects from './screens/InnerObjects';
import HomeScreen from './screens/Start';
import DetailsScreen from './screens/Intro';
import ScreenObjectDetails from './screens/InnerObjectDetails';
import ScreenSuppler from './screens/Supplier';
import ScreenSupplierRequests from './screens/Supplier/FindOrder';
import ScreenSupplierRequest from './screens/Supplier/OrderDetails';
import {RootStackParamList} from './types/typesNavigation';
import ScreenSignup from './screens/Signup';
import ScreenLogin from './screens/Login';
import ScreenAdmin from './screens/InnerAdmin';
import i18n from './i18n';

const t = i18n.t;

export const allRoutes: {
  [file in keyof RootStackParamList]: {
    component: (k: any) => React.JSX.Element;
    path: string;
    showBack?: boolean;
    protected?: boolean;
  };
} = {
  Start: {
    component: HomeScreen,
    path: '',
    showBack: false,
    protected: false,
  },
  Signup: {
    component: ScreenSignup,
    path: 'signup',
    protected: false,
  },
  Login: {
    component: ScreenLogin,
    path: 'login',
    protected: false,
  },
  Intro: {
    component: DetailsScreen,
    path: 'intro',
    showBack: false,
  },
  OrderDetails: {
    component: ScreenOrderDetails,
    path: 'order',
  },

  Admin: {
    component: ScreenAdmin,
    path: 'admin',
  },

  Objects: {
    component: ScreenObjects,
    path: 'objects/list',
  },
  ObjectDetails: {
    component: ScreenObjectDetails,
    path: 'object/details',
  },
  Supplier: {
    component: ScreenSuppler,
    path: 'supplier',
  },
  SupplierRequests: {
    component: ScreenSupplierRequests,
    path: 'supplier/search',
  },
  SupplierRequest: {
    component: ScreenSupplierRequest,
    path: 'supplier/order',
  },
};

export const screens = Object.entries(allRoutes).reduce((o, [k, v]) => {
  return {...o, [k]: v.path};
}, {});

export const allRoutesTrans: (t: typeof i18n.t) => {
  [file in keyof RootStackParamList]: {
    title?: string;
  };
} = (t) => ({
  Start: {},
  Signup: {
    title: t('routes:signup'),
  },
  Login: {
    title: t('routes:login'),
  },
  Intro: {
    title: t('routes:orders'),
  },
  OrderDetails: {
    title: t('routes:order'),
  },
  Admin: {
    title: 'Admin',
  },

  Objects: {
    title: t('routes:objects'),
  },
  ObjectDetails: {
    title: t('routes:object'),
  },
  Supplier: {
    title: t('routes:supplier'),
  },
  SupplierRequests: {
    title: t('routes:supplierRequests'),
  },
  SupplierRequest: {
    title: t('routes:supplierRequest'),
  },
});
