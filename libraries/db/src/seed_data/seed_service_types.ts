import {EntityServiceTypes} from '../entity/ServiceTypes';

// ADD USERS
const service_type_1 = new EntityServiceTypes();
service_type_1.serviceName = {en: 'Cleaning', ru: 'Уборка', de: 'Cleaning'};

// await AppDataSourceSqlite.manager.save(user);

const service_type_2 = new EntityServiceTypes();
service_type_2.serviceName = {
  en: 'Мойка окон',
  ru: 'Window washing',
  de: 'Fensterwaschen',
};

export {service_type_1, service_type_2};

// };
