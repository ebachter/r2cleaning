export type Cleaning = {
  objectType: 'appartment' | 'entrance' | 'house' | 'office' | 'fasade';
  options: {
    appartment: {
      numberOfRooms: {number: number; price: number};
      kitchen: {
        all: {value: boolean; price: number};
        sink: {value: boolean; price: number};
        refrigerator: {value: boolean; price: number};
        oven: {value: boolean; price: number};
      };
      bathroom: {value: boolean; price: number};
    };
  };
  order: {
    city: 'grosny' | 'argun' | 'gudermes';
    address: string;
  };
};
