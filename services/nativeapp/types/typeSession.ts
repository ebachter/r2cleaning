export type RootStackParamList = {
  HomeExt: undefined;
  HomeInt: undefined;
  Order: undefined;
  Orders: undefined;
  Objects: undefined;
  Object: undefined;
  OrderDetails: {orderId: string};
};

export type Session = {
  sessionToken: string | null;
  refreshToken?: string | null;
  phone?: `+${number | ''}`;
  smsSent?: boolean;
  modals: {
    login: boolean;
    signup: boolean;
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
