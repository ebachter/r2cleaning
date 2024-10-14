import {drizzle} from 'drizzle-orm/mysql2';
import {createConnection} from 'mysql2/promise';
import {
  city,
  country,
  object,
  objectType,
  requests,
  supplierService,
  service,
  user,
  offer,
  requestService,
  order,
  supplierCity,
} from './schema';

const main = async () => {
  const client = await createConnection(Bun.env.DB_URL!);
  const db = drizzle(client, {logger: true});

  try {
    await db.insert(user).values([
      {
        id: 1,
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'bach1@remrob.com',
        age: 24,
        balance: '21.3',
        phoneNumber: '+491633649875',
        isAdmin: true,
        passwordHash:
          '$2b$04$kCu7zdh5P/27bae5X.G5QeJD61hactK/ZYOA4JYi0ApMMSCScUVF2',
      },
      {
        id: 2,
        firstName: 'Cleaning',
        lastName: 'Company',
        email: 'bach2@remrob.com',
        age: 21,
        balance: '2.5',
        phoneNumber: '+491633649875',
        passwordHash:
          '$2b$04$kCu7zdh5P/27bae5X.G5QeJD61hactK/ZYOA4JYi0ApMMSCScUVF2',
      },
    ]);

    await db.insert(service).values([
      {
        id: 1,
        name: {
          de: 'Cleaning',
          en: 'Cleaning',
          ru: 'Уборка',
        },
      },
      {
        id: 2,
        name: {
          de: 'Fensterwaschen',
          en: 'Мойка окон',
          ru: 'Window washing',
        },
      },
    ]);

    await db.insert(objectType).values([
      {
        id: 1,
        name: {en: 'house', de: 'house', ru: 'house'},
      },
      {
        id: 2,
        name: {en: 'appartment', de: 'appartment', ru: 'appartment'},
      },
      {
        id: 3,
        name: {en: 'entrance', de: 'entrance', ru: 'entrance'},
      },
      {
        id: 4,
        name: {en: 'office', de: 'office', ru: 'office'},
      },
      {
        id: 5,
        name: {en: 'fasade', de: 'fasade', ru: 'fasade'},
      },
    ]);

    await db.insert(country).values([
      {
        id: 1,
        nameEn: 'Russia',
        nameDe: 'Russland',
        nameRu: 'Россия',
      },
    ]);

    await db.insert(city).values([
      {
        id: 1,
        country: 1,
        nameEn: 'Grosny',
        nameRu: 'Грозный',
        nameDe: 'Grosny',
        userId: 1,
      },
      {
        id: 2,
        country: 1,
        nameEn: 'Argun',
        nameRu: 'Аргун',
        nameDe: 'Argun',
        userId: 1,
      },
      {
        id: 3,
        country: 1,
        nameEn: 'Gudermes',
        nameRu: 'Гудермес',
        nameDe: 'Gudermes',
        userId: 1,
      },
    ]);

    await db.insert(supplierService).values([
      {
        id: 1,
        serviceId: 1,
        userId: 2,
      },
      {
        id: 2,
        serviceId: 1,
        userId: 1,
      },
    ]);

    await db.insert(supplierCity).values([
      {
        id: 1,
        cityId: 1,
        userId: 1,
      },
      {
        id: 2,
        cityId: 2,
        userId: 1,
      },
    ]);

    await db.insert(object).values([
      {
        id: 1,
        addressCity: 1,
        addressStreet: 'Kasiora 16',
        type: 1,
        area: '12.00',
        userId: 1,
        details: {
          kitchen: {
            all: {
              price: 1500,
              value: false,
            },
            oven: {
              price: 500,
              value: false,
            },
            sink: {
              price: 500,
              value: false,
            },
            refrigerator: {
              price: 500,
              value: false,
            },
          },
          bathroom: {
            area: 0,
            price: 1000,
            include: false,
          },
          object_type: 'appartment',
          numberOfRooms: {
            price: 2000,
            number: 1,
          },
        },
      },
      {
        id: 2,
        addressCity: 2,
        addressStreet: 'Ioanisiani 124',
        type: 2,
        area: '83.00',
        userId: 2,
        details: {
          object_type: 'office',
          numberOfRooms: {
            price: 400,
            number: 0,
          },
        },
      },
    ]);

    // //////////// REQUEST / OFFER / ORDER //////////// //
    await db.insert(requests).values([
      {
        id: 1,
        // price: '1.23',
        userId: 1,
        objectId: 1,
        cleaningDate: '2024-12-15',
      },
      {
        id: 2,
        // price: '2.34',
        userId: 1,
        objectId: 2,
        cleaningDate: '2024-12-15',
      },
      {
        id: 3,
        // price: '200.30',
        userId: 1,
        objectId: 2,
        cleaningDate: '2024-12-15',
      },
      {
        id: 4,
        // price: '200.30',
        userId: 1,
        objectId: 1,
        cleaningDate: '2024-12-15',
      },
      {
        id: 5,
        // price: '200.30',
        userId: 1,
        objectId: 2,
        cleaningDate: '2024-12-15',
      },
    ]);

    await db.insert(requestService).values([
      {
        id: 1,
        requestId: 1,
        serviceId: 1,
        userId: 1,
      },
      {
        id: 2,
        requestId: 1,
        serviceId: 2,
        userId: 1,
      },
      {
        id: 3,
        requestId: 2,
        serviceId: 1,
        userId: 1,
      },
      {
        id: 4,
        requestId: 3,
        serviceId: 2,
        userId: 1,
      },
    ]);

    const date = new Date();

    await db.insert(offer).values([
      {
        id: 1,
        requestId: 1,
        userId: 1,
        cleaningDate: '2024-12-15',
        cleaningTime: date.getHours() + ':' + date.getMinutes(),
        price: '220',
      },
      {
        id: 2,
        requestId: 2,
        userId: 1,
        cleaningDate: '2024-12-15',
        cleaningTime: date.getHours() + ':' + date.getMinutes(),
        price: '244.34',
      },
      {
        id: 3,
        requestId: 2,
        userId: 2,
        cleaningDate: '2024-12-15',
        cancelledAt: new Date(),
        cleaningTime: date.getHours() + ':' + date.getMinutes(),
        price: '280',
      },
      {
        id: 4,
        requestId: 3,
        userId: 1,
        cleaningDate: '2024-12-15',
        cleaningTime: date.getHours() + ':' + date.getMinutes(),
        price: '285',
      },
      {
        id: 5,
        requestId: 3,
        userId: 2,
        cleaningDate: '2024-12-15',
        cleaningTime: date.getHours() + ':' + date.getMinutes(),
        price: '270',
      },
    ]);

    await db.insert(order).values([
      {
        id: 1,
        requestId: 1,
        offerId: 1,
      },
      {
        id: 2,
        requestId: 2,
        offerId: 2,
      },
    ]);

    console.log('done');
  } catch (e) {
    console.log(e);
  }
};

main().finally(() => process.exit(0));
