import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Objects} from '@remrob/db';

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

export const initialStateObject: Omit<Objects, 'object_id'> = {
  object_type: null,
  address_city: null,
  address_street: '',
  user_fk: null,
  area: null,
  object_details: null,
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
      action: PayloadAction<Partial<Omit<Objects, 'object_id'>>>,
    ) => {
      _.merge(state, action.payload);
    },
    /* setObject: (state, action: PayloadAction<Partial<Cleaning['object']>>) => {
      _.merge(state.object, action.payload);
    }, */

    /* setModals: (state, action: PayloadAction<Partial<Cleaning['modals']>>) => {
      _.merge(state.modals, action.payload);
    },
    setCleaningInit: (state) => {
      state = initialStateObject;
    },
    setOrderFormInit: (state) => {
      state.order = initOrderFormData;
    },
    showSnackbar: (
      state,
      action: PayloadAction<Cleaning['snackbarVisible']>,
    ) => {
      state.snackbarVisible.value = action.payload.value;
      state.snackbarVisible.text = action.payload.text;
    }, */
  },
});

export const reducerObject = slice.reducer;
export const actionObject = slice.actions;
