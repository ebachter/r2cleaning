import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {store} from './store';
import {Cleaning} from '../types/typesCleaning';

/* type Cleaning = {
  objectType: 'appartment' | 'entrance' | 'house' | 'office' | 'fasade';
}; */

const kitchen = {
  all: {value: false, price: 1500},
  sink: {value: false, price: 500},
  refrigerator: {value: false, price: 500},
  oven: {value: false, price: 500},
};

const initialState: Cleaning = {
  order: {
    objectType: 'appartment',
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
    city: null,
    address: '',
    review: {
      phone: '+',
    },
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
    setAdress: (state, action: PayloadAction<string>) => {
      state.order.address = action.payload;
    },
    setCity: (state, action: PayloadAction<Cleaning['order']['city']>) => {
      state.order.city = action.payload;
    },
    setPhone: (
      state,
      action: PayloadAction<Cleaning['order']['review']['phone']>,
    ) => {
      state.order.review.phone = action.payload;
    },
  },
});

export const cleaningReducers = slice.reducer;
export const cleaningActions = slice.actions;
