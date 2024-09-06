import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TypeOrder} from '@remrob/mysql';
import _ from 'lodash';

/* type Cleaning = {
  objectType: 'appartment' | 'entrance' | 'house' | 'office' | 'fasade';
}; */

type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};

const kitchen = {
  all: {value: false, price: 1500},
  sink: {value: false, price: 500},
  refrigerator: {value: false, price: 500},
  oven: {value: false, price: 500},
};

export const initialStateCleaning: TypeOrder /* & {
  object: DeepNullable<Omit<Objects, 'user_fk' | 'data' | 'object_id'>>;
} */ = {
  object: {
    userId: null,
    id: null,
    type: null,
    addressCity: null,
    addressStreet: null,
    // object_details: null,
    area: null,
    label: null,
  },
  options: {
    appartment: {
      numberOfRooms: {number: 1, price: 2000},
      kitchen,
      bathroom: {include: false, area: 0, price: 1000},
    },
    entrance: {
      numberOfFloors: {number: 0, price: 0},
    },
    house: {
      numberOfRooms: {number: 0, price: 0},
      kitchen,
      bathroom: {include: false, area: 0, price: 1000},
    },
    office: {
      numberOfRooms: {
        number: 0,
        price: 400,
      },
    },
    fasade: {
      numberOfFloors: {number: 0, price: 4000},
    },
  },
  /* review: {
      phone: '+491633649875',
    },
    smsSent: false, */

  orderCreated: false,
  price: null,
  serviceType: null,
};

const slice = createSlice({
  name: 'order',
  initialState: initialStateCleaning,
  reducers: {
    /* setObjectType: (
      state,
      action: PayloadAction<Cleaning['order']['objectType']>,
    ) => {
      state.order.objectType = action.payload;
    }, */
    setRoomNumberOfAppartment: (state, action: PayloadAction<number>) => {
      state.options.appartment.numberOfRooms.number = action.payload;
    },
    setKitchenOfAppartment: (
      state,
      action: PayloadAction<TypeOrder['options']['appartment']['kitchen']>,
    ) => {
      state.options.appartment.kitchen = action.payload;
    },
    setBathroomOfAppartment: (state, action: PayloadAction<boolean>) => {
      state.options.appartment.bathroom.include = action.payload;
    },
    /* setPhone: (
      state,
      action: PayloadAction<Cleaning['order']['review']['phone']>,
    ) => {
      state.order.review.phone = action.payload;
    }, */

    setOrder: (state, action: PayloadAction<Partial<TypeOrder>>) => {
      _.merge(state, action.payload);
    },

    /* setModals: (state, action: PayloadAction<Partial<Cleaning['modals']>>) => {
      _.merge(state.modals, action.payload);
    }, */
    setCleaningInit: (state) => {
      state = initialStateCleaning;
    },
    setOrderFormInit: (state) => {
      state = initialStateCleaning;
    },

    mergeOrder: (state, action: PayloadAction<Partial<TypeOrder>>) => {
      _.merge(state, action.payload);
      // state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const cleaningReducers = slice.reducer;
export const cleaningActions = slice.actions;
