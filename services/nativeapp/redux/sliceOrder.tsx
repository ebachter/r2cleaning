import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import {RouterOutputs} from '../trpc';
import {TypeOrder} from '../types/typeOrder';
/* type Cleaning = {
  objectType: 'appartment' | 'entrance' | 'house' | 'office' | 'fasade';
}; */

type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};

export const initialStateCleaning: TypeOrder = {
  date: null,
  object: {
    id: null,
    type: null,
    addressCity: null,
    addressStreet: null,
    // object_details: null,
    area: null,
    objectType: {
      id: null,
      name: {en: null},
    },
  },
  orderCreated: false,
  price: null,
  service: {type: null, label: null},
};

const slice = createSlice({
  name: 'order',
  initialState: initialStateCleaning,
  reducers: {
    setOrderFormInit: (state) => {
      state = initialStateCleaning;
    },

    mergeOrder: (state, action: PayloadAction<Partial<TypeOrder>>) => {
      _.merge(state, action.payload);
    },
  },
});

export const cleaningReducers = slice.reducer;
export const cleaningActions = slice.actions;
