import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import {TypeObject} from '../types/typeObject';

const kitchen = {
  all: {value: false, price: 1500},
  sink: {value: false, price: 500},
  refrigerator: {value: false, price: 500},
  oven: {value: false, price: 500},
};

export const initialStateObject: TypeObject = {
  type: null,
  addressCity: null,
  addressStreet: '',
  userId: null,
  area: null,
  details: null,
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
};

const slice = createSlice({
  name: 'object',
  initialState: initialStateObject,
  reducers: {
    mergeObject: (state, action: PayloadAction<Partial<TypeObject>>) => {
      _.merge(state, action.payload);
    },
  },
});

export const reducerObject = slice.reducer;
export const actionObject = slice.actions;
