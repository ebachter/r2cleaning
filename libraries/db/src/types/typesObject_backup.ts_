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
      objectType: 'appartment';
      rooms: PrivateRoom[];
      kitchen: Kitchen[];
      restroom: Restroom[];
    }
  | {
      objectType: 'house';
      rooms: PrivateRoom[];
      kitchen: Kitchen[];
      restroom?: Restroom[];
      floors: {number: number};
      elevator: boolean;
    }
  | {
      objectType: 'entrance';
      floors: {number: number};
      elevator: boolean;
    }
  | {
      objectType: 'office';
      rooms: PublicRoom[];
    }
  | {
      objectType: 'fasade';
      floors: {number: number};
      cover: 'glass' | 'color' | 'tile';
    };

type Kitchen = RoomProperties & {
  // all: {value: boolean};
  sink: boolean;
  refrigerator: boolean;
  oven: boolean;
};

type Restroom = RoomProperties & {bath: boolean; toilet: boolean};

type RoomProperties = {
  floor: 'parket' | 'laminat' | 'linoleum' | 'tile' | 'wood' | 'beton';
  walls: 'tile' | 'wallpaper' | 'color';
};

type PublicRoom = {
  type: 'room' | 'corridor' | 'storageroom';
} & RoomProperties;

type PrivateRoom = {
  type: 'bedroom' | 'livingroom' | 'childroom' | 'corridor' | 'storageroom';
} & RoomProperties;
