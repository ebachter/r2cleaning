import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Search, SearchUser} from '../types/typesSearch';

// const initialState = null as UserNullable;
const initialState: Search = {
  objects: [],
  widgets: [],
  models: [],
  services: [],
  users: [],
};

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchUser: (state, action: PayloadAction<SearchUser>) => {
      state.users.push(action.payload);
    },
    clearSearchUsers: (state) => {
      state.users = [];
    },
  },
});

export const searchUsersReducers = slice.reducer;

export const {setSearchUser, clearSearchUsers} = slice.actions;
