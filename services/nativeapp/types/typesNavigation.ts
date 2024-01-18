import {NavigationProp} from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Order: undefined;
};

export type StackNavigation = NavigationProp<RootStackParamList>;
