import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import drizzle, {
  object,
  order,
  serviceOffer,
  serviceType,
  user,
} from '@remrob/drizzle';

type ObjectType = typeof object.$inferSelect;

import _ from 'lodash';

type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};

const kitchen = {
  all: {value: false, price: 1500},
  sink: {value: false, price: 500},
  refrigerator: {value: false, price: 500},
  oven: {value: false, price: 500},
};

export const initialStateObject: Omit<ObjectType, 'id'> = {
  type: null,
  addressCity: null,
  addressStreet: '',
  userId: null,
  area: null,
  details: null,
};

const slice = createSlice({
  name: 'object',
  initialState: initialStateObject,
  reducers: {
    /* setObjectType: (
      state,
      action: PayloadAction<Cleaning['order']['objectType']>,
    ) => {
      state.order.objectType = action.payload;
    }, */
    /* setRoomNumberOfAppartment: (state, action: PayloadAction<number>) => {
      state.order.options.appartment.numberOfRooms.number = action.payload;
    },
    setKitchenOfAppartment: (
      state,
      action: PayloadAction<
        Cleaning['order']['options']['appartment']['kitchen']
      >,
    ) => {
      state.order.options.appartment.kitchen = action.payload;
    },
    setBathroomOfAppartment: (state, action: PayloadAction<boolean>) => {
      state.order.options.appartment.bathroom.include = action.payload;
    },
    setPhone: (
      state,
      action: PayloadAction<Cleaning['order']['review']['phone']>,
    ) => {
      state.order.review.phone = action.payload;
    }, */

    setObject: (
      state,
      action: PayloadAction<Partial<Omit<ObjectType, 'id'>>>,
    ) => {
      _.merge(state, action.payload);
    },
  },
});

export const reducerObject = slice.reducer;
export const actionObject = slice.actions;
