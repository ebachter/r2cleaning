import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Session} from '../types/typeSession';
import {store} from './store';

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
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const sessionReducers = slice.reducer;

export const sessionSet = (
  ...args: Parameters<typeof slice.actions.sessionSet>
) => store.dispatch(slice.actions.sessionSet(...args));
