import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TypeUser} from '@remrob/mysql';

// const initialState = null as UserNullable;
const initialState: Omit<
  TypeUser,
  | 'bio'
  | 'refreshToken'
  | 'password'
  | 'clients'
  | 'user_active'
  | 'balance'
  | 'services_amount'
  | 'created_at'
  | 'terminated_at'
> = {
  user_id: null,
  email: '',
  username: '',
  name: '',
  language: 'en',
  timezone: 'Europe/Berlin',
  user_image_hash: '',
  plan: 'basic',
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userSet: (state, action: PayloadAction<TypeUser>) => {
      return action.payload;
    },
    userClear: () => initialState,
  },
});

export const userReducers = slice.reducer;

export const {userSet, userClear} = slice.actions;
