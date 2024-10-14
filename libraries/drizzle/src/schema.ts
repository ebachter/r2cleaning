import {relations} from 'drizzle-orm';
import {
  boolean,
  date,
  decimal,
  int,
  json,
  mysqlTable,
  time,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core';

const price = decimal('price', {precision: 10, scale: 4});
const createdAt = timestamp('createdAt', {
  mode: 'date',
})
  .notNull()
  .defaultNow();

const updatedAt = timestamp('updatedAt', {
  mode: 'date',
})
  .notNull()
  .defaultNow()
  .$onUpdateFn(() => new Date());

export const user = mysqlTable(
  'users',
  {
    id: int('id', {unsigned: true}).primaryKey().autoincrement(),
    firstName: varchar('firstName', {length: 50}).notNull().default(''),
    lastName: varchar('lastName', {length: 50}).notNull().default(''),
    age: int('age', {unsigned: true}),
    balance: decimal('balance', {precision: 10, scale: 4}).default('0'),
    phoneNumber: varchar('phoneNumber', {length: 20}),
    email: varchar('email', {length: 40}),
    passwordHash: varchar('passwordHash', {length: 100}).notNull(),
    isAdmin: boolean('isAdmin').notNull().default(false),
    createdAt,
    updatedAt,
  },
  (t) => ({
    unq: unique('uq_email').on(t.email),
  }),
);

export const verification = mysqlTable(
  'verification',
  {
    id: int('id', {unsigned: true}).primaryKey().autoincrement(),
    firstName: varchar('firstName', {length: 40}).notNull(),
    lastName: varchar('lastName', {length: 40}).notNull(),
    passwordHash: varchar('passwordHash', {length: 100}).notNull(),
    phoneNumber: varchar('phoneNumber', {length: 20}),
    email: varchar('email', {length: 40}),
    verificationCode: varchar('verificationCode', {length: 20}),
    ip: varchar('ip', {length: 20}),
    counter: int('counter').default(0).notNull(),
    createdAt,
    updatedAt,
  },
  (t) => ({
    unq1: unique('uq_email').on(t.email),
    unq2: unique('uq_ip').on(t.ip),
  }),
);

export const service = mysqlTable('services', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  name: json('name').$type<{en: string; de: string; ru: string}>().notNull(),
});

export const objectType = mysqlTable('objectTypes', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  name: json('name').$type<{en: string; de: string; ru: string}>().notNull(),
});

export const supplierService = mysqlTable('supplierServices', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  userId: int('userId', {unsigned: true})
    .references(() => user.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  serviceId: int('serviceId', {unsigned: true})
    .references(() => service.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
});

export const supplierServiceRelations = relations(supplierService, ({one}) => ({
  user: one(user, {
    fields: [supplierService.userId],
    references: [user.id],
  }),
  service: one(service, {
    fields: [supplierService.serviceId],
    references: [service.id],
  }),
}));

export const requests = mysqlTable('requests', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  objectId: int('objectId', {unsigned: true})
    .references(() => object.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  userId: int('userId', {unsigned: true})
    .references(() => user.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  cleaningDate: date('cleaningDate').notNull(),
  createdAt,
  updatedAt,
});

export const requestRelations = relations(requests, ({one}) => ({
  object: one(object, {
    fields: [requests.objectId],
    references: [object.id],
  }),
  customer: one(user, {
    fields: [requests.userId],
    references: [user.id],
  }),
}));

//////////////////////////////////////////////////////////////////////

export const offer = mysqlTable(
  'offers',
  {
    id: int('id', {unsigned: true}).primaryKey().autoincrement(),
    requestId: int('requestId', {unsigned: true})
      .references(() => requests.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      })
      .notNull(),
    userId: int('userId', {unsigned: true})
      .references(() => user.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      })
      .notNull(),
    cleaningTime: time('cleaningTime').notNull(),
    cleaningDate: date('cleaningDate').notNull(),
    price: price.notNull(),
    cancelledAt: timestamp('cancelledAt'),
    createdAt,
    updatedAt,
  },
  (t) => ({
    unq: unique('uq_requestId_userId').on(t.requestId, t.userId),
  }),
);

export const offerRelations = relations(offer, ({one}) => ({
  request: one(requests, {
    fields: [offer.requestId],
    references: [requests.id],
  }),
  customer: one(user, {
    fields: [offer.userId],
    references: [user.id],
  }),
}));

//////////////////////////////////////////////////////////////
export const order = mysqlTable(
  'orders',
  {
    id: int('id', {unsigned: true}).primaryKey().autoincrement(),
    requestId: int('requestId', {unsigned: true})
      .references(() => requests.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      })
      .notNull(),
    offerId: int('offerId', {unsigned: true})
      .references(() => requests.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      })
      .notNull(),
    createdAt,
    updatedAt,
  },
  (t) => ({
    unqReq: unique('uq_requestId').on(t.requestId),
    unqOffer: unique('uq_offerId').on(t.offerId),
  }),
);

export const orderRelations = relations(order, ({one}) => ({
  type: one(offer, {
    fields: [order.offerId],
    references: [offer.id],
  }),
}));

////////////////////////////////////////////////////////

export const requestService = mysqlTable('requestServices', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  requestId: int('requestId', {unsigned: true})
    .references(() => requests.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  serviceId: int('serviceId', {unsigned: true})
    .references(() => service.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  userId: int('userId', {unsigned: true})
    .references(() => user.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
});

export const requestServiceRelations = relations(requestService, ({one}) => ({
  request: one(requests, {
    fields: [requestService.requestId],
    references: [requests.id],
  }),
  service: one(service, {
    fields: [requestService.serviceId],
    references: [service.id],
  }),
  user: one(user, {
    fields: [requestService.userId],
    references: [user.id],
  }),
}));

export const object = mysqlTable('objects', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  addressCity: int('city', {unsigned: true})
    .references(() => city.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  addressStreet: varchar('addressStreet', {length: 255}).notNull(),
  type: int('objectType', {unsigned: true})
    .references(() => objectType.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),

  area: decimal('area', {precision: 10, scale: 4}).notNull(),
  userId: int('userId', {unsigned: true})
    .references(() => user.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  details: json('details').notNull(),
});

export const objectRelations = relations(object, ({one}) => ({
  user: one(user, {
    fields: [object.userId],
    references: [user.id],
  }),
  objectType: one(objectType, {
    fields: [object.type],
    references: [objectType.id],
  }),
  city: one(city, {
    fields: [object.addressCity],
    references: [city.id],
  }),
}));

export const city = mysqlTable(
  'cities',
  {
    id: int('id', {unsigned: true}).primaryKey().autoincrement(),
    // name: json('name').$type<{en: string; de: string; ru: string}>().notNull(),
    country: int('country', {unsigned: true})
      .references(() => country.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      })
      .notNull()
      .default(1),
    nameEn: varchar('nameEn', {length: 100}).notNull(),
    nameDe: varchar('nameDe', {length: 100}).notNull(),
    nameRu: varchar('nameRu', {length: 100}).notNull(),
    userId: int('userId', {unsigned: true})
      .references(() => user.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      })
      .notNull(),
    createdAt,
    updatedAt,
  },
  (t) => ({
    unqEn: unique('uq_city_en').on(t.country, t.nameEn),
    unqDe: unique('uq_city_de').on(t.country, t.nameDe),
    unqRu: unique('uq_city_ru').on(t.country, t.nameRu),
  }),
);

export const country = mysqlTable(
  'countries',
  {
    id: int('id', {unsigned: true}).primaryKey().autoincrement(),
    nameEn: varchar('nameEn', {length: 100}).notNull(),
    nameDe: varchar('nameDe', {length: 100}).notNull(),
    nameRu: varchar('nameRu', {length: 100}).notNull(),
    createdAt,
    updatedAt,
  },
  (t) => ({
    unqEn: unique('uq_country_nameEn').on(t.nameEn),
    unqDe: unique('uq_country_nameDe').on(t.nameDe),
    unqRu: unique('uq_country_nameRu').on(t.nameRu),
  }),
);

export const supplierCity = mysqlTable(
  'supplierCities',
  {
    id: int('id', {unsigned: true}).primaryKey().autoincrement(),
    cityId: int('cityId', {unsigned: true})
      .references(() => city.id)
      .notNull(),
    userId: int('userId', {unsigned: true})
      .references(() => user.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      })
      .notNull(),
    createdAt,
    updatedAt,
  },
  (t) => ({
    uq_supplieCity: unique('uq_supplierCity').on(t.cityId, t.userId),
  }),
);
