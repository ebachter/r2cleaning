export type Cleaning = {
  // options: {};
  order: {
    objectType: 'appartment';
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
