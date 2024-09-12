import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _, {now} from 'lodash';
import {TypeOrder} from '../types/typeOrder';

type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};

export const initialStateCleaning: TypeOrder = {
  date: new Date(),
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
  name: 'request',
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

export const requestReducers = slice.reducer;
export const requestActions = slice.actions;
