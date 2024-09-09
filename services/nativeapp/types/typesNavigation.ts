// import {NavigationProp} from '@react-navigation/native';

import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  HomeExt: undefined;
  HomeInt: undefined;
  Requests: undefined;
  Objects: undefined;
  OrderDetails: {requestId: number};
  ObjectDetails: {objectId: number};
  Supplier: undefined;
  SupplierServices: undefined;
  SupplierRequests: undefined;
  SupplierRequest: {requestId: string};
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
