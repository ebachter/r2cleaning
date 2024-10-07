import {createNavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList, RouteParamList} from './types/typesNavigation';
import {CommonActions} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// export function navigate(name: keyof RootStackParamList, params) {
export function navigate(val: RouteParamList) {
  if (navigationRef.isReady()) {
    // navigationRef.navigate(name, params);
    const [name, params] = Object.entries(val)[0];
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name, params}],
      }),
    );
  }
}
