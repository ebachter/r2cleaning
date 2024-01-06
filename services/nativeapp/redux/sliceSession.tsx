import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Session} from '../types/typeSession';

const initialState: Session = {
  sessionToken: null,
  refreshToken: null,
};

const slice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionSet: (state, action: PayloadAction<Session>) => {
      state.sessionToken = action.payload.sessionToken;
      // state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const sessionReducers = slice.reducer;
export const sessionActions = slice.actions;
