import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {store} from './store';

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    message: 'Initial message',
  },
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
});

export const {setMessage} = messageSlice.actions;

// export const setMessage = (str: string) => {
//  store.dispatch(messageSlice.actions.setMessage(str));
// };

export default messageSlice.reducer;
