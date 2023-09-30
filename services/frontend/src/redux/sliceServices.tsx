import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TrpcReturnTypes} from '../types/typesHelpers';

type TrpcAppLoadServices = TrpcReturnTypes['appGetServices'][number];
// type QueryReduced = Omit<TrpcAppLoadServices, 'project_id'>;
const initialState: {[serviceId: number]: TrpcAppLoadServices} = {};

const slice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    serviceSet: (
      state,
      action: PayloadAction<{
        serviceId: number;
        serviceData: TrpcAppLoadServices;
      }>,
    ) => {
      state[action.payload.serviceId] = action.payload.serviceData;
    },
    servicesClear: () => initialState,
  },
});

export const servicesReducers = slice.reducer;

export const {serviceSet, servicesClear} = slice.actions;
