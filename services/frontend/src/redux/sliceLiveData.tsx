import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ObjectLive, ObjectsLive} from '@remrob/mysql';
import _ from 'lodash';
import {store} from './store';

const initialState: ObjectsLive = {};

const slice = createSlice({
  name: 'live',
  initialState,
  reducers: {
    liveObjectDisconnected: (
      state,
      action: PayloadAction<{objectId: number}>,
    ) => {
      // state[action.payload.objectId] = action.payload.liveData;

      const {objectId} = action.payload;
      delete state[objectId];
    },
    liveDataSet: (
      state,
      action: PayloadAction<{objectId: number} & ObjectLive>,
    ) => {
      // state[action.payload.objectId] = action.payload.liveData;

      const {objectId, ...rest} = action.payload;
      console.log('++', objectId, rest);

      /* if (rest.connected === 'no') {
        state[objectId] = initialState;
        // state[objectId].live = dataInitialObjectLive;
      } else { */
      /* if ('lists' in rest) {
          for (const listId in rest.lists) {
            // state.lists[listId]=rest.lists[listId]
            _.set(state, `${objectId}.lists.${listId}`, rest.lists[listId]);
            // state[objectId].lists[listId] = rest.lists[listId];
          }
        } else { */
      console.log('##', objectId, rest);
      _.merge(state, {[objectId]: rest});
      //}
    },
    liveDataClear: () => initialState,
  },
});

export const liveDataReducers = slice.reducer;

export const liveDataActions = slice.actions;

export const liveDataSet = (
  ...args: Parameters<typeof slice.actions.liveDataSet>
) => store.dispatch(slice.actions.liveDataSet(...args));

export const liveObjectDisconnected = (
  ...args: Parameters<typeof slice.actions.liveObjectDisconnected>
) => store.dispatch(slice.actions.liveObjectDisconnected(...args));

export const liveDataClear = (
  ...args: Parameters<typeof slice.actions.liveDataClear>
) => store.dispatch(slice.actions.liveDataClear(...args));
