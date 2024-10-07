// import {NavigationProp} from '@react-navigation/native';

import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  HomeExt: {};
  Signup: {};
  Login: {};
  HomeInt: {};
  Admin: {};
  Objects: {};
  OrderDetails: {orderId: number};
  ObjectDetails: {objectId: number};
  Supplier: {};
  SupplierRequests: {};
  SupplierRequest: {orderId: string};
};

type ValueOf<T> = T[keyof T];
type Split<T extends object> = ValueOf<{
  [K in keyof T]: {[P in K]: T[P]};
}>;

export type RouteParamList = Split<RootStackParamList>;

// export type StackNavigation = NavigationProp<RootStackParamList>;

export type RouteProps<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
