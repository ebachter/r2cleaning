import {relations} from 'drizzle-orm';
import {
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
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
});

export const serviceType = mysqlTable('serviceType', {
  id: int('id', {unsigned: true}).primaryKey(),
  name: json('name').$type<{en: string; de: string; ru: string}>().notNull(),
});

export const serviceOffer = mysqlTable('serviceOffer', {
  id: int('id', {unsigned: true}).primaryKey(),
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
  id: int('id', {unsigned: true}).primaryKey(),
  price: decimal('price', {precision: 10, scale: 4}),
  objectId: int('objectId', {unsigned: true})
    .references(() => object.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  providerId: int('providerId', {unsigned: true})
    .references(() => user.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
  customerId: int('customerId', {unsigned: true})
    .references(() => user.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    })
    .notNull(),
});

export const orderRelations = relations(order, ({one}) => ({
  object: one(object, {
    fields: [order.objectId],
    references: [object.id],
  }),
  provider: one(user, {
    fields: [order.providerId],
    references: [user.id],
  }),
  customer: one(user, {
    fields: [order.customerId],
    references: [user.id],
  }),
}));

export const orderService = mysqlTable('orderService', {
  id: int('id', {unsigned: true}).primaryKey(),
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

export const orderServiceRelations = relations(orderService, ({one}) => ({
  order: one(order, {
    fields: [orderService.orderId],
    references: [order.id],
  }),
  serviceType: one(serviceType, {
    fields: [orderService.serviceTypeId],
    references: [serviceType.id],
  }),
  user: one(user, {
    fields: [orderService.userId],
    references: [user.id],
  }),
}));

export const object = mysqlTable('object', {
  id: int('id', {unsigned: true}).primaryKey(),
  addressCity: mysqlEnum('addressCity', [
    'grosny',
    'argun',
    'gudermes',
  ]).notNull(),
  addressStreet: varchar('addressStreet', {length: 255}).notNull(),
  type: mysqlEnum('objectType', [
    'house',
    'appartment',
    'entrance',
    'office',
    'fasade',
  ]).notNull(),
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
}));
