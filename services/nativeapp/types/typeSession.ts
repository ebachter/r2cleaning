export type Session = {
  sessionToken: string | null;
  refreshToken?: string | null;
  phone?: `+${number | ''}`;
  smsSent?: boolean;

  /* forms: {
    order: {
      object: Pick<
        Objects,
        'object_id' | 'object_type' | 'address_city' | 'address_street' | 'area'
      >;
    };
  }; */
};
