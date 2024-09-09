import {RootStackParamList} from './typesNavigation';

export type TypeLocal = {
  modals: {
    login: boolean;
    signup: boolean;
    addObject: boolean;
    addOrder: boolean;
    forwardTo?: keyof RootStackParamList;
  };
  snackbarVisible: {text: string; value?: boolean};
};
