import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Cleaning} from '@remrob/mysql';
import _ from 'lodash';

/* type Cleaning = {
  objectType: 'appartment' | 'entrance' | 'house' | 'office' | 'fasade';
}; */

const kitchen = {
  all: {value: false, price: 1500},
  sink: {value: false, price: 500},
  refrigerator: {value: false, price: 500},
  oven: {value: false, price: 500},
};

const initOrderFormData: Cleaning['order'] & {
  objectId: Cleaning['order']['objectId'] | null;
  objectType: Cleaning['order']['objectType'] | null;
} = {
  objectId: null,
  objectType: null,
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
    phone: '+491633649875',
  },
  smsSent: false,
  orderCreated: false,
};

export const initialStateCleaning: Cleaning = {
  order: initOrderFormData,
  modals: {
    login: false,
    signup: false,
  },
  snackbarVisible: {text: '', value: false},
  object: {
    objectType: null,
    area: null,
    city: null,
    address: '',
  },
};

const slice = createSlice({
  name: 'session',
  initialState: initialStateCleaning,
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

    setOrder: (state, action: PayloadAction<Partial<Cleaning['order']>>) => {
      _.merge(state.order, action.payload);
    },
    setObject: (state, action: PayloadAction<Partial<Cleaning['object']>>) => {
      _.merge(state.object, action.payload);
    },

    setModals: (state, action: PayloadAction<Partial<Cleaning['modals']>>) => {
      _.merge(state.modals, action.payload);
    },
    setCleaningInit: (state) => {
      state = initialStateCleaning;
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
    },
  },
});

export const cleaningReducers = slice.reducer;
export const cleaningActions = slice.actions;
