export type Cleaning = {
  // options: {};
  order: {
    appartment: Appartment;
    objectType: 'appartment';
    city: 'grosny' | 'argun' | 'gudermes';
    address: string;
  };
};

type Appartment = {
  objectType: 'appartment';
  numberOfRooms: {number: number; price: number};
  kitchen: {
    all: {value: boolean; price: number};
    sink: {value: boolean; price: number};
    refrigerator: {value: boolean; price: number};
    oven: {value: boolean; price: number};
  };
  bathroom: {value: boolean; price: number};
};

type Entrance = {
  objectType: 'entrance';
  numberOfRooms: {number: number; price: number};
  bathroom: {value: boolean; price: number};
};

type House = {
  objectType: 'house';
  numberOfRooms: {number: number; price: number};
  bathroom: {value: boolean; price: number};
};

type Office = {
  objectType: 'office';
  numberOfRooms: {number: number; price: number};
  bathroom: {value: boolean; price: number};
};

type Fasade = {
  objectType: 'fasade';
  numberOfRooms: {number: number; price: number};
  bathroom: {value: boolean; price: number};
};
