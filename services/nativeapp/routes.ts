import ScreenOrderDetails from './screens/InnerRequestDetails';
import ScreenObjects from './screens/InnerObjects';
import HomeScreen from './screens/OuterHome';
import DetailsScreen from './screens/InnerHome';
import OrderScreen from './screens/InnerRequestCreate';
import OrdersScreen from './screens/InnerRequestList';
import ObjectScreen from './screens/InnerObjectAdd';

export type RootStackParamList = {
  HomeExt: undefined;
  HomeInt: undefined;
  Order: undefined;
  Orders: undefined;
  Objects: undefined;
  Object: undefined;
  OrderDetails: {orderId: string};
};

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
  HomeInt: {
    name: 'HomeInt',
    component: DetailsScreen,
    path: 'intro',
    title: 'Главная',
  },
  OrderDetails: {
    name: 'OrderDetails',
    component: ScreenOrderDetails,
    path: 'details',
    title: 'Детали',
  },
  Order: {name: 'Order', component: OrderScreen, path: 'order', title: 'Заказ'},
  Orders: {
    name: 'Orders',
    component: OrdersScreen,
    path: 'orders',
    title: 'Заказы',
  },
  Objects: {
    name: 'Objects',
    component: ScreenObjects,
    path: 'objects',
    title: 'Объекты',
  },
  Object: {
    name: 'Object',
    component: ObjectScreen,
    path: 'object',
    title: 'Объект',
  },
};

export const screens = Object.entries(allRoutes).reduce((o, [k, v]) => {
  return {...o, [k]: v.path};
}, {});
console.log(screens);
