import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {Session} from '../types/typeSession';
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
  },
});

export const cleaningReducers = slice.reducer;

// export const {setObjectType} = slice.actions;

export const setObjectType = (
  ...args: Parameters<typeof slice.actions.setObjectType>
) => store.dispatch(slice.actions.setObjectType(...args));

export const setRoomNumberOfAppartment = (
  ...args: Parameters<typeof slice.actions.setRoomNumberOfAppartment>
) => store.dispatch(slice.actions.setRoomNumberOfAppartment(...args));

export const setKitchenOfAppartment = (
  ...args: Parameters<typeof slice.actions.setKitchenOfAppartment>
) => store.dispatch(slice.actions.setKitchenOfAppartment(...args));

export const setBathroomOfAppartment = (
  ...args: Parameters<typeof slice.actions.setBathroomOfAppartment>
) => store.dispatch(slice.actions.setBathroomOfAppartment(...args));

// export const setKitchenOfAppartment = slice.actions.setKitchenOfAppartment;
