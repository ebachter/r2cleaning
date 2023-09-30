import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TrpcReturnTypes} from '../types/typesHelpers';

type TrpcAppLoadObjects =
  TrpcReturnTypes['trpcAppProjectsLoad']['projects'][number];

type QueryReduced = Omit<TrpcAppLoadObjects, 'project_id'>;

const initialState: {[objectId: number]: QueryReduced} = {};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    projectsSet: (
      state,
      action: PayloadAction<{
        projectId: number;
        projectData: QueryReduced;
      }>,
    ) => {
      state[action.payload.projectId] = action.payload.projectData;
    },
    projectsClear: () => initialState,
  },
});

export const projectsReducers = slice.reducer;

export const {projectsSet, projectsClear} = slice.actions;
