import {EntityUser} from '../entity/User';

// ADD USERS
const userraw1 = new EntityUser();
userraw1.firstName = 'Max';
userraw1.lastName = 'Mustermann';
userraw1.age = 24;
userraw1.balance = 21.3;
userraw1.phoneNumber = '+491633649875';
// await AppDataSourceSqlite.manager.save(user);

const userraw2 = new EntityUser();
userraw2.firstName = 'Cleaner';
userraw2.lastName = 'Copany';
userraw2.age = 10;
userraw2.balance = 2.5;
userraw2.phoneNumber = '+491633649875';
// await AppDataSourceSqlite.manager.save(user2);
console.log('Users created');

export {userraw1, userraw2};

// };
