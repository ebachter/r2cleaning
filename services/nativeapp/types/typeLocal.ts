import {RootStackParamList} from './typesNavigation';

export type TypeLocal = {
  modals: {
    login: {
      open: boolean;
      emailOrPhoneValue: string; //`+${number | ''}`
      loginType: 'phone' | 'email';
    };
    signup: boolean;
    addObject: boolean;
    addOrder: boolean;
    forwardTo?: keyof RootStackParamList;
  };
  snackbarVisible: {text: string; value?: boolean};
};
