import {createNavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from './types/typesNavigation';
import {CommonActions} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params) {
  if (navigationRef.isReady()) {
    // navigationRef.navigate(name, params);
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name, params}],
      }),
    );
  }
}
