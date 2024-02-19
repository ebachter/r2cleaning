import {createNavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from '@remrob/mysql';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
