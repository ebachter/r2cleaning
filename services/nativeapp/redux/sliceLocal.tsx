import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import {TypeLocal} from '../types/typeLocal';

export const localInitialState: TypeLocal = {
  modals: {
    login: {open: false, emailOrPhoneValue: null, loginType: null},
    signup: false,
    addObject: false,
    addOrder: false,
  },
  snackbarVisible: {text: '', value: false},
};

const slice = createSlice({
  name: 'local',
  initialState: localInitialState,
  reducers: {
    mergeLocal: (state, action: PayloadAction<Partial<TypeLocal>>) => {
      _.merge(state, action.payload);
    },
  },
});

export const localReducers = slice.reducer;
export const localActions = slice.actions;
