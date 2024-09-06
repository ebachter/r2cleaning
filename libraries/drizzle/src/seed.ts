import {drizzle} from 'drizzle-orm/mysql2';
import {createConnection} from 'mysql2/promise';
import {
  object,
  objectType,
  order,
  serviceOffer,
  serviceType,
  user,
} from './schema';

const main = async () => {
  const client = await createConnection(process.env.DB_URL!);
  const db = drizzle(client, {logger: true});

  try {
    await db.insert(user).values([
      {
        id: 1,
        firstName: 'Max',
        lastName: 'Mustermann',
        age: 24,
        balance: '21.3',
        phoneNumber: '+491633649875',
      },
      {
        id: 2,
        firstName: 'Cleaning',
        lastName: 'Company',
        age: 21,
        balance: '2.5',
        phoneNumber: '+491633649875',
      },
    ]);

    await db.insert(serviceType).values([
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

    await db.insert(serviceOffer).values([
      {
        id: 1,
        price: '12',
        serviceTypeId: 1,
        userId: 2,
      },
      {
        id: 2,
        price: '12',
        serviceTypeId: 1,
        userId: 1,
      },
    ]);

    await db.insert(object).values([
      {
        id: 1,
        addressCity: 'grosny',
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
        addressCity: 'argun',
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

    await db.insert(order).values([
      {
        id: 1,
        // price: '1.23',
        userId: 2,
        objectId: 1,
        date: new Date(),
      },
      {
        id: 2,
        // price: '2.34',
        userId: 1,
        objectId: 2,
        date: new Date(),
      },
    ]);

    console.log('done');
  } catch (e) {
    console.log(e);
  }
};

main().finally(() => process.exit(0));
