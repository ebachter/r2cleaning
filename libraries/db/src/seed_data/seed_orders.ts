import {EntityObject} from '../entity/Objects';
import {EntityOrder} from '../entity/Orders';

export const order_data_1 = ({
  userId,
  objectId,
}: {
  userId: EntityObject['user_fk'];
  objectId: EntityObject['object_id'];
}) => {
  const order = new EntityOrder();
  order.object_fk = objectId;
  order.user_fk = userId;
  // order.object_type = 'appartment';
  return order;
};

export const order_data_2 = ({
  userId,
  objectId,
}: {
  userId: EntityObject['user_fk'];
  objectId: EntityObject['object_id'];
}) => {
  const order2 = new EntityOrder();
  order2.object_fk = objectId;
  order2.user_fk = userId;
  // order.object_type = 'appartment';
  return order2;
};

export const order_data_3 = ({
  userId,
  objectId,
}: {
  userId: EntityObject['user_fk'];
  objectId: EntityObject['object_id'];
}) => {
  const order3 = new EntityOrder();
  order3.object_fk = objectId;
  order3.user_fk = userId;
  // order3.object_type = 'entrance';
  order3.price = 3;
  order3.contractor_fk = objectId;
  return order3;
};
