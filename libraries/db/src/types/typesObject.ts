export const objectTypes = [
  'house',
  'appartment',
  'entrance',
  'office',
  'fasade',
] as const;

export type TypeObjectTypesArr = typeof objectTypes;
export type TypeObjectTypesUnion = (typeof objectTypes)[number];

export type ObjectDetails =
  | {
      object_type: 'appartment';
      numberOfRooms: {number: number; price: number};
      kitchen: Kitchen;
      bathroom: Bathroom;
    }
  | {object_type: 'entrance'; numberOfFloors: {number: number; price: number}}
  | {
      object_type: 'house';
      numberOfRooms: {number: number; price: number};
      kitchen: Kitchen;
      bathroom: Bathroom;
    }
  | {object_type: 'office'; numberOfRooms: {number: number; price: number}}
  | {object_type: 'fasade'; numberOfFloors: {number: number; price: number}};

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
