import {EntityServiceOffers} from '../entity/ServiceOffers';

// ADD USERS
export const fn_service_offer_1 = ({
  service_type_fk,
  user_fk,
}: Pick<EntityServiceOffers, 'user_fk' | 'service_type_fk'>) => {
  const temp: Omit<EntityServiceOffers, 'service_offer_id'> = {
    service_type_fk: service_type_fk,
    user_fk,
    price: 12,
  };

  const obj = new EntityServiceOffers();
  Object.assign(obj, temp);

  return obj;
};
