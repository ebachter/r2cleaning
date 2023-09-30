import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TypeUserContacts} from '@remrob/mysql';

const initialState: {[userId: string]: Omit<TypeUserContacts, 'user_fk'>} = {};

const slice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    contactSet: (
      state,
      action: PayloadAction<{
        userId: number;
        contactData: Omit<TypeUserContacts, 'user_fk'>;
      }>,
    ) => {
      state[action.payload.userId] = action.payload.contactData;
    },
    contactsClear: () => initialState,
  },
});

export const contactsReducers = slice.reducer;

export const {contactSet, contactsClear} = slice.actions;
