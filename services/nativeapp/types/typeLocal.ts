import {RootStackParamList} from '../routes';

export type TypeLocal = {
  modals: {
    login: boolean;
    signup: boolean;
    addObject: boolean;
    forwardTo?: keyof RootStackParamList;
  };
  snackbarVisible: {text: string; value?: boolean};

  /* forms: {
    order: {
      object: Pick<
        Objects,
        'object_id' | 'object_type' | 'address_city' | 'address_street' | 'area'
      >;
    };
  }; */
};
