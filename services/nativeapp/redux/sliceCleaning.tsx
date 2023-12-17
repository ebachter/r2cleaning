import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {store} from './store';
import {Cleaning} from '../types/typesCleaning';

/* type Cleaning = {
  objectType: 'appartment' | 'entrance' | 'house' | 'office' | 'fasade';
}; */

const initialState: Cleaning = {
  objectType: 'appartment',
  options: {
    appartment: {
      numberOfRooms: {number: 1, price: 2000},
      kitchen: {
        all: {value: false, price: 1500},
        sink: {value: false, price: 500},
        refrigerator: {value: false, price: 500},
        oven: {value: false, price: 500},
      },
      bathroom: {value: false, price: 1000},
    },
  },
  order: {
    city: null,
    address: '',
  },
};

const slice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setObjectType: (state, action: PayloadAction<Cleaning['objectType']>) => {
      state.objectType = action.payload;
    },
    setRoomNumberOfAppartment: (state, action: PayloadAction<number>) => {
      state.options.appartment.numberOfRooms.number = action.payload;
    },
    setKitchenOfAppartment: (
      state,
      action: PayloadAction<Cleaning['options']['appartment']['kitchen']>,
    ) => {
      state.options.appartment.kitchen = action.payload;
    },
    setBathroomOfAppartment: (state, action: PayloadAction<boolean>) => {
      state.options.appartment.bathroom.value = action.payload;
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
