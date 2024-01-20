import {NavigationProp} from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Order: undefined;
  Orders: undefined;
};

export type StackNavigation = NavigationProp<RootStackParamList>;
