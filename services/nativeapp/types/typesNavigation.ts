// import {NavigationProp} from '@react-navigation/native';

import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  HomeExt: undefined;
  Signup: undefined;
  HomeInt: undefined;
  Objects: undefined;
  OrderDetails: {orderId: number};
  ObjectDetails: {objectId: number};
  Supplier: undefined;
  SupplierRequests: undefined;
  SupplierRequest: {orderId: string};
};

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
