import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import {TypeOffer} from '../types/typeOffer';

export const offerInitialState: TypeOffer = {
  time: {hours: null, minutes: null},
  price: 0,
};

const slice = createSlice({
  name: 'offer',
  initialState: offerInitialState,
  reducers: {
    /* sessionSet: (state, action: PayloadAction<Session>) => {
      state.sessionToken = action.payload.sessionToken;
      // state.refreshToken = action.payload.refreshToken;
    }, */
    mergeOffer: (state, action: PayloadAction<Partial<TypeOffer>>) => {
      _.merge(state, action.payload);
      // state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const offerReducer = slice.reducer;
export const offerActions = slice.actions;
