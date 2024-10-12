import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Session} from '../types/typeSession';
import _ from 'lodash';

export const sessionInitialState: Session = {
  sessionToken: null,
  refreshToken: null,
  smsSent: false,
};

const slice = createSlice({
  name: 'session',
  initialState: sessionInitialState,
  reducers: {
    mergeSession: (state, action: PayloadAction<Partial<Session>>) => {
      _.merge(state, action.payload);
    },
  },
});

export const sessionReducers = slice.reducer;
export const sessionActions = slice.actions;
