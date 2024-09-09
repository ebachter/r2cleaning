import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Session} from '../types/typeSession';
import _ from 'lodash';

export const sessionInitialState: Session = {
  sessionToken: null,
  refreshToken: null,
  phone: '+491633649875',
  smsSent: false,
};

const slice = createSlice({
  name: 'session',
  initialState: sessionInitialState,
  reducers: {
    mergeSession: (state, action: PayloadAction<Partial<Session>>) => {
      _.merge(state, action.payload);
    },
    setPhone: (state, action: PayloadAction<Session['phone']>) => {
      state.phone = action.payload;
    },
  },
});

export const sessionReducers = slice.reducer;
export const sessionActions = slice.actions;
