import ScreenOrderDetails from './screens/InnerOrderDetails';
import ScreenObjects from './screens/InnerObjects';
import HomeScreen from './screens/OuterHome';
import DetailsScreen from './screens/InnerHome';
import ScreenObjectDetails from './screens/InnerObjectDetails';
import ScreenSuppler from './screens/Supplier';
import ScreenSupplierRequests from './screens/Supplier/FindOrder';
import ScreenSupplierRequest from './screens/Supplier/OrderDetails';
import {RootStackParamList} from './types/typesNavigation';
import ScreenSignup from './screens/Signup';
import ScreenLogin from './screens/Login';

export const allRoutes: {
  [file in keyof RootStackParamList]: {
    name: keyof RootStackParamList;
    component: (k: any) => React.JSX.Element;
    path: string;
    showBack?: boolean;
    title?: string;
    protected?: boolean;
  };
} = {
  HomeExt: {
    name: 'HomeExt',
    component: HomeScreen,
    path: '',
    showBack: false,
    protected: false,
  },
  Signup: {
    name: 'Signup',
    component: ScreenSignup,
    path: 'signup',
    showBack: true,
    protected: false,
  },
  Login: {
    name: 'Login',
    component: ScreenLogin,
    path: 'login',
    showBack: true,
    protected: false,
  },
  HomeInt: {
    name: 'HomeInt',
    component: DetailsScreen,
    path: 'intro',
    title: 'Главная',
  },
  OrderDetails: {
    name: 'OrderDetails',
    component: ScreenOrderDetails,
    path: 'order',
    title: 'Детали',
  },
  Objects: {
    name: 'Objects',
    component: ScreenObjects,
    path: 'objects/list',
    title: 'Объекты',
  },
  ObjectDetails: {
    name: 'ObjectDetails',
    component: ScreenObjectDetails,
    path: 'object/details',
    title: 'Object details',
  },
  Supplier: {
    name: 'Supplier',
    component: ScreenSuppler,
    path: 'supplier',
    title: 'Supplier',
  },
  SupplierRequests: {
    name: 'SupplierRequests',
    component: ScreenSupplierRequests,
    path: 'supplier/search',
    title: 'Customer requests',
  },
  SupplierRequest: {
    name: 'SupplierRequest',
    component: ScreenSupplierRequest,
    path: 'supplier/order',
    title: 'Order details',
  },
};

export const screens = Object.entries(allRoutes).reduce((o, [k, v]) => {
  return {...o, [k]: v.path};
}, {});
console.log(screens);
