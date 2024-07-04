import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import {TypeLocal} from '../types/typeLocal';

export const localInitialState: TypeLocal = {
  modals: {
    login: false,
    signup: false,
    addObject: false,
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
