export type Cleaning = {
  objectType: 'appartment' | 'entrance' | 'house' | 'office' | 'fasade';
  options: {
    appartment: {
      numberOfRooms: number;
      kitchen: {
        all: boolean;
        sink: boolean;
        refrigerator: boolean;
        oven: boolean;
      };
      bathroom: boolean;
    };
  };
};
