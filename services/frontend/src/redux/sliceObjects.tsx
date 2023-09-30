import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TrpcReturnTypes} from '../types/typesHelpers';

type TrpcAppLoadObjects =
  TrpcReturnTypes['trpcAppLoadObjects']['objects'][number];

type QueryObjectsReduced = Omit<TrpcAppLoadObjects, 'object_id'>;

const initialState: {[objectId: number]: QueryObjectsReduced} = {};

const slice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    objectSet: (
      state,
      action: PayloadAction<{
        objectId: number;
        objectData: QueryObjectsReduced;
      }>,
    ) => {
      const {objectId} = action.payload;

      state[objectId] = action.payload.objectData;

      // if (!state[objectId].connected_at)
      //   state[objectId].connected_at = new Date();

      // setLiveData({objectId, ...dataInitialObjectLive});
    },

    /* setObjectLive: (
      state,
      action: PayloadAction<
        {
          objectId: number;
        } & ObjectLive
      >,
    ) => {
      const {objectId, ...rest} = action.payload;
      _.merge(state[objectId].live, rest);

      if (!state[objectId].connected_at)
        state[objectId].connected_at = new Date();

      if (action.payload.connected === 'no') {
        state[objectId].live = dataInitialObjectLive;
      }
    }, */

    objectsClear: () => initialState,
  },
});

export const objectsReducers = slice.reducer;

export const {objectSet, objectsClear} = slice.actions;
