import {EntityServiceOffers} from '../entity/ServiceOffers';
import {EntityServiceTypes} from '../entity/ServiceTypes';
import {EntityUser} from '../entity/User';

// ADD USERS
export const fn_service_offer_1 = ({
  service_type,
  user,
}: {user: EntityUser} & {
  service_type: EntityServiceTypes;
}) => {
  const temp: Omit<EntityServiceOffers, 'service_offer_id'> = {
    service_type,
    user,
    price: 12,
  };

  const obj = new EntityServiceOffers();
  Object.assign(obj, temp);

  return obj;
};
