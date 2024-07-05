import ScreenOrderDetails from './screens/InnerOrderDetails';
import ScreenObjects from './screens/InnerObjects';
import HomeScreen from './screens/OuterHome';
import DetailsScreen from './screens/InnerHome';
import OrdersScreen from './screens/InnerOrderList';
import ScreenObjectDetails from './screens/InnerObjectDetails';
import {NavigationProp} from '@react-navigation/native';

export type RootStackParamList = {
  HomeExt: undefined;
  HomeInt: undefined;
  Orders: undefined;
  Objects: undefined;
  OrderDetails: {orderId: number};
  ObjectDetails: {objectId: number};
};

export type StackNavigation = NavigationProp<RootStackParamList>;

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
    path: 'order/details',
    title: 'Детали',
  },
  Orders: {
    name: 'Orders',
    component: OrdersScreen,
    path: 'orders',
    title: 'Заказы',
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
};

export const screens = Object.entries(allRoutes).reduce((o, [k, v]) => {
  return {...o, [k]: v.path};
}, {});
console.log(screens);
