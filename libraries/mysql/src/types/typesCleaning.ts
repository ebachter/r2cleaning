export type ObjectTypeOptions = [
  'house',
  'appartment',
  'entrance',
  'office',
  'fasade',
];

type TupleToUnion<T extends unknown[]> = T[number];

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
    object: {
      objectId: number;
      objectType: Cleaning['object']['objectType'];
      address: string;
    };
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
    price: number;
  };
  modals: {
    login: boolean;
    signup: boolean;
    forwardTo?: keyof RootStackParamList;
  };
  snackbarVisible: {text: string; value?: boolean};

  object: {
    objectType: TupleToUnion<ObjectTypeOptions>;
    area: number;
    city: 'grosny' | 'argun' | 'gudermes';
    address: string;
  };
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
