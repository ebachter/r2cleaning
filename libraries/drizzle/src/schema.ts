import {relations} from 'drizzle-orm';
import {
  date,
  decimal,
  int,
  json,
  mysqlEnum,
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
  'user',
  {
    id: int('id', {unsigned: true}).primaryKey().autoincrement(),
    firstName: varchar('firstName', {length: 50}).notNull().default(''),
    lastName: varchar('lastName', {length: 50}).notNull().default(''),
    age: int('age', {unsigned: true}),
    balance: decimal('balance', {precision: 10, scale: 4}).default('0'),
    phoneNumber: varchar('phoneNumber', {length: 20}),
    email: varchar('email', {length: 40}),
    passwordHash: varchar('passwordHash', {length: 100}),
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
    verificationId: varchar('verificationId', {length: 20}),
    createdAt,
    updatedAt,
  },
  (t) => ({
    unq: unique('uq_email').on(t.email),
  }),
);

export const serviceType = mysqlTable('serviceType', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  name: json('name').$type<{en: string; de: string; ru: string}>().notNull(),
});

export const objectType = mysqlTable('objectType', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  name: json('name').$type<{en: string; de: string; ru: string}>().notNull(),
});

export const serviceOffer = mysqlTable('serviceOffer', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  userId: int('userId', {unsigned: true})
    .references(() => user.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  serviceTypeId: int('serviceTypeId', {unsigned: true})
    .references(() => serviceType.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
});

export const serviceOfferRelations = relations(serviceOffer, ({one}) => ({
  user: one(user, {
    fields: [serviceOffer.userId],
    references: [user.id],
  }),
  serviceType: one(serviceType, {
    fields: [serviceOffer.serviceTypeId],
    references: [serviceType.id],
  }),
}));

export const requests = mysqlTable('request', {
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
  'offer',
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
    price: price.notNull(),
    createdAt,
    updatedAt,
  },
  (t) => ({
    unq: unique('offer_uq_requestId_userId').on(t.requestId, t.userId),
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
  'order',
  {
    id: int('id', {unsigned: true}).primaryKey().autoincrement(),
    objectId: int('objectId', {unsigned: true})
      .references(() => object.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      })
      .notNull(),
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
    cleaningDate: date('cleaningDate').notNull(),
    cleaningTime: time('cleaningTime').notNull(),
    price: price.notNull(),
    createdAt,
    updatedAt,
  },
  (t) => ({
    unq: unique('uq_requestId_offerId').on(t.requestId, t.offerId),
  }),
);

export const orderRelations = relations(order, ({one}) => ({
  object: one(object, {
    fields: [order.objectId],
    references: [object.id],
  }),
  request: one(requests, {
    fields: [order.requestId],
    references: [requests.id],
  }),
  type: one(offer, {
    fields: [order.offerId],
    references: [offer.id],
  }),
}));

////////////////////////////////////////////////////////

export const requestService = mysqlTable('requestService', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  requestId: int('requestId', {unsigned: true})
    .references(() => requests.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  serviceTypeId: int('serviceTypeId', {unsigned: true})
    .references(() => serviceType.id, {
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
  serviceType: one(serviceType, {
    fields: [requestService.serviceTypeId],
    references: [serviceType.id],
  }),
  user: one(user, {
    fields: [requestService.userId],
    references: [user.id],
  }),
}));

export const object = mysqlTable('object', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  addressCity: mysqlEnum('addressCity', [
    'grosny',
    'argun',
    'gudermes',
  ]).notNull(),
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
}));
