import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {store} from './store';
import {Cleaning} from '../types/typesCleaning';

/* type Cleaning = {
  objectType: 'appartment' | 'entrance' | 'house' | 'office' | 'fasade';
}; */

const initialState: Cleaning = {
  // options: {},
  order: {
    appartment: {
      objectType: 'appartment',
      numberOfRooms: {number: 1, price: 2000},
      kitchen: {
        all: {value: false, price: 1500},
        sink: {value: false, price: 500},
        refrigerator: {value: false, price: 500},
        oven: {value: false, price: 500},
      },
      bathroom: {value: false, price: 1000},
    },
    objectType: 'appartment',
    city: null,
    address: '',
  },
};

const slice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setObjectType: (
      state,
      action: PayloadAction<Cleaning['order']['objectType']>,
    ) => {
      state.order.objectType = action.payload;
    },
    setRoomNumberOfAppartment: (state, action: PayloadAction<number>) => {
      state.order.appartment.numberOfRooms.number = action.payload;
    },
    setKitchenOfAppartment: (
      state,
      action: PayloadAction<Cleaning['order']['appartment']['kitchen']>,
    ) => {
      state.order.appartment.kitchen = action.payload;
    },
    setBathroomOfAppartment: (state, action: PayloadAction<boolean>) => {
      state.order.appartment.bathroom.value = action.payload;
    },
    setAdress: (state, action: PayloadAction<string>) => {
      state.order.address = action.payload;
    },
    setCity: (state, action: PayloadAction<Cleaning['order']['city']>) => {
      state.order.city = action.payload;
    },
  },
});

export const cleaningReducers = slice.reducer;
export const cleaningActions = slice.actions;
