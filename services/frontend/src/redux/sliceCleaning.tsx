import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {Session} from '../types/typeSession';
import {store} from './store';
import {Cleaning} from '../types/typesCleaning';

/* type Cleaning = {
  objectType: 'appartment' | 'entrance' | 'house' | 'office' | 'fasade';
}; */

const initialState: Cleaning = {
  objectType: 'appartment',
};

const slice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setObjectType: (state, action: PayloadAction<Cleaning['objectType']>) => {
      state.objectType = action.payload;
    },
  },
});

export const cleaningReducers = slice.reducer;

// export const {setObjectType} = slice.actions;

export const setObjectType = (
  ...args: Parameters<typeof slice.actions.setObjectType>
) => store.dispatch(slice.actions.setObjectType(...args));
