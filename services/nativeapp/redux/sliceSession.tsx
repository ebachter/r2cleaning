import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Session} from '../types/typeSession';

const initialState: Session = {
  sessionToken: null,
  refreshToken: null,
  phone: '+491633649875',
  smsSent: false,
};

const slice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionSet: (state, action: PayloadAction<Session>) => {
      state.sessionToken = action.payload.sessionToken;
      // state.refreshToken = action.payload.refreshToken;
    },
    setPhone: (state, action: PayloadAction<Session['phone']>) => {
      state.phone = action.payload;
      // state.refreshToken = action.payload.refreshToken;
    },
    actionSmsSent: (state, action: PayloadAction<Session['smsSent']>) => {
      state.smsSent = action.payload;
      // state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const sessionReducers = slice.reducer;
export const sessionActions = slice.actions;
