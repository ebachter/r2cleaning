import {relations} from 'drizzle-orm';
import {
  date,
  datetime,
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

export const user = mysqlTable('user', {
  id: int('id', {unsigned: true}).primaryKey(),
  firstName: varchar('firstName', {length: 50}).notNull(),
  lastName: varchar('lastName', {length: 50}).notNull(),
  age: int('age', {unsigned: true}).notNull(),
  balance: decimal('balance', {precision: 10, scale: 4}),
  phoneNumber: varchar('phoneNumber', {length: 20}).notNull(),
});

export const verification = mysqlTable('verification', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  phoneNumber: varchar('phoneNumber', {length: 20}).notNull(),
  verificationId: varchar('verificationId', {length: 20}).notNull(),
  createdAt: timestamp('createdAt', {
    mode: 'date',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
  })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

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
  price: decimal('price', {precision: 10, scale: 4}),
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

export const order = mysqlTable('order', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  // price: decimal('price', {precision: 10, scale: 4}),
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
  date: date('date').notNull(),
});

export const orderRelations = relations(order, ({one}) => ({
  object: one(object, {
    fields: [order.objectId],
    references: [object.id],
  }),
  customer: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  type: one(objectType, {
    fields: [order.id],
    references: [objectType.id],
  }),
}));

export const offer = mysqlTable(
  'offer',
  {
    id: int('id', {unsigned: true}).primaryKey().autoincrement(),
    time: time('time').notNull(),
    orderId: int('orderId', {unsigned: true})
      .references(() => order.id, {
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
    createdAt: timestamp('createdAt', {
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    unq: unique('offer_uq_orderId_userId').on(t.orderId, t.userId),
  }),
);

export const offerRelations = relations(offer, ({one}) => ({
  object: one(order, {
    fields: [offer.orderId],
    references: [order.id],
  }),
  customer: one(user, {
    fields: [offer.userId],
    references: [user.id],
  }),
}));

export const requestService = mysqlTable('orderService', {
  id: int('id', {unsigned: true}).primaryKey().autoincrement(),
  orderId: int('orderId', {unsigned: true})
    .references(() => order.id, {
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

export const orderServiceRelations = relations(requestService, ({one}) => ({
  order: one(order, {
    fields: [requestService.orderId],
    references: [order.id],
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
