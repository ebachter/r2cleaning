import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Session} from '../types/typeSession';
import _ from 'lodash';

export const sessionInitialState: Session = {
  sessionToken: null,
  refreshToken: null,
  phone: '+491633649875',
  smsSent: false,
  modals: {
    login: false,
    signup: false,
  },
  snackbarVisible: {text: '', value: false},

  /* forms: {
    order: {
      object: {
        object_id: null,
        object_type: null,
        address_city: null,
        address_street: null,
        area: null,
      },
    },
  }, */
};

const slice = createSlice({
  name: 'session',
  initialState: sessionInitialState,
  reducers: {
    /* sessionSet: (state, action: PayloadAction<Session>) => {
      state.sessionToken = action.payload.sessionToken;
      // state.refreshToken = action.payload.refreshToken;
    }, */
    mergeSession: (state, action: PayloadAction<Partial<Session>>) => {
      _.merge(state, action.payload);
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

    showSnackbar: (
      state,
      action: PayloadAction<Session['snackbarVisible']>,
    ) => {
      state.snackbarVisible.value = action.payload.value;
      state.snackbarVisible.text = action.payload.text;
    },
  },
});

export const sessionReducers = slice.reducer;
export const sessionActions = slice.actions;
