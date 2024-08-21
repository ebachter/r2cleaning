/* export type ObjectTypeOptions = [
  'house',
  'appartment',
  'entrance',
  'office',
  'fasade',
]; */
import {EntityObject} from '@remrob/db';

// type TupleToUnion<T extends unknown[]> = T[number];

export type TypeOrder = {
  object: Omit<EntityObject, 'user_fk' | 'object_details'>;
  // Omit<Objects, 'user_fk' | 'data'>;
  options: {
    appartment: Appartment;
    entrance: Entrance;
    house: House;
    office: Office;
    fasade: Fasade;
  };
  /* review: {
      phone: `+${number | ''}`;
    };
    smsSent: boolean; */

  orderCreated: boolean;
  price: number;

  // object: Omit<Objects, 'user_fk' | 'data'>;
  /* object: {
    objectType: TupleToUnion<ObjectTypeOptions>;
    area: number;
    city: 'grosny' | 'argun' | 'gudermes';
    address: string;
  }; */
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
