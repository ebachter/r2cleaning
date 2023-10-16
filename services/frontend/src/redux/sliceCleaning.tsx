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
      numberOfRooms: 1,
      kitchen: {
        all: false,
        sink: false,
        refrigerator: false,
        oven: false,
      },
      bathroom: false,
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
      state.options.appartment.numberOfRooms = action.payload;
    },
    setKitchenOfAppartment: (
      state,
      action: PayloadAction<Cleaning['options']['appartment']['kitchen']>,
    ) => {
      state.options.appartment.kitchen = action.payload;
    },
    setBathroomOfAppartment: (state, action: PayloadAction<boolean>) => {
      state.options.appartment.bathroom = action.payload;
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
