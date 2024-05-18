export type ObjectTypeOptions = [
  'house',
  'appartment',
  'entrance',
  'office',
  'fasade',
];

type TupleToUnion<T extends unknown[]> = T[number];

export type TypeOrder = {
  objectType: TupleToUnion<ObjectTypeOptions>;
  user_fk: number;
};

// type Keys = keyof Cleaning['order']['options'];

// type KeysEnum<T> = { [P in keyof Required<T>]: true };
// type newtype = KeysEnum<Cleaning['order']['options']>

export type RootStackParamList = {
  HomeExt: undefined;
  HomeInt: undefined;
  Order: undefined;
  Orders: undefined;
  Objects: undefined;
  Object: undefined;
  Details: {orderId: string};
};

export type Cleaning = {
  // options: {};
  order: {
    objectType: TypeOrder['objectType'];
    options: {
      appartment: Appartment;
      entrance: Entrance;
      house: House;
      office: Office;
      fasade: Fasade;
    };
    city: 'grosny' | 'argun' | 'gudermes';
    address: string;
    review: {
      phone: `+${number | ''}`;
    };

    smsSent: boolean;
    orderCreated: boolean;
  };
  modals: {
    login: boolean;
    signup: boolean;
    forwardTo?: keyof RootStackParamList;
  };
  snackbarVisible: {text: string; value?: boolean};
};

type Kitchen = {
  all: {value: boolean; price: number};
  sink: {value: boolean; price: number};
  refrigerator: {value: boolean; price: number};
  oven: {value: boolean; price: number};
};

type Bathroom = {include: boolean; area: number; price: number};

type Appartment = {
  numberOfRooms: {number: number; price: number};
  kitchen: Kitchen;
  bathroom: Bathroom;
};

type Entrance = {
  numberOfFloors: {number: number; price: number};
};

type House = {
  numberOfRooms: {number: number; price: number};
  kitchen: Kitchen;
  bathroom: Bathroom;
};

type Office = {
  numberOfRooms: {number: number; price: number};
};

type Fasade = {
  numberOfFloors: {number: number; price: number};
};
