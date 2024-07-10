import {EntityObject} from '../entity/Objects';

export const object_raw_1 = ({userId}: {userId: EntityObject['user_fk']}) => {
  const obj: Omit<EntityObject, 'object_id'> = {
    object_type: 'appartment',
    user_fk: userId,
    area: 12,
    address_city: 'grosny',
    address_street: 'Kasiora 16',
    object_details: {
      object_type: 'appartment',

      numberOfRooms: {number: 1, price: 2000},
      kitchen: {
        all: {value: false, price: 1500},
        sink: {value: false, price: 500},
        refrigerator: {value: false, price: 500},
        oven: {value: false, price: 500},
      },
      bathroom: {include: false, area: 0, price: 1000},
    },
  };
  const object_raw_1 = new EntityObject();
  Object.assign(object_raw_1, obj);

  return object_raw_1;
};
// const obj1 = await AppDataSourceSqlite.manager.save(objectObj);

export const object_raw_2 = ({userId}: {userId: EntityObject['user_fk']}) => {
  const obj: Omit<EntityObject, 'object_id'> = {
    object_type: 'office',
    user_fk: userId,
    area: 83,
    address_city: 'argun',
    address_street: 'Ioanisiani 124',
    object_details: {
      object_type: 'office',
      numberOfRooms: {
        number: 0,
        price: 400,
      },
    },
  };

  const new_obj = new EntityObject();
  Object.assign(new_obj, obj);
  return new_obj;
};
