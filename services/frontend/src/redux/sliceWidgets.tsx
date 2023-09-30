import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Widget, Widgets} from '../types/typesWidgets';

const initialState: Widgets = {};

const slice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    widgetSet: (
      state,
      action: PayloadAction<{
        widgetId: number;
        widgetData: Widget;
      }>,
    ) => {
      state[action.payload.widgetId] = action.payload.widgetData;
    },
    widgetsClear: () => initialState,
  },
});

export const widgetsReducers = slice.reducer;

export const {widgetSet, widgetsClear} = slice.actions;
