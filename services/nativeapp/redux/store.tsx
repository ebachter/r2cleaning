import {configureStore} from '@reduxjs/toolkit';
import {cleaningReducers} from './sliceCleaning';
import {sessionReducers} from './sliceSession';
import {useDispatch, useSelector} from 'react-redux';
import type {TypedUseSelectorHook} from 'react-redux';

export const store = configureStore({
  reducer: {
    cleaning: cleaningReducers,
    session: sessionReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const getAppState = () => store.getState();

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
