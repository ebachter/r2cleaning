import {useDispatch, useSelector} from 'react-redux';
import type {TypedUseSelectorHook} from 'react-redux';
import {RootState, AppDispatch, store} from '../redux/store';
import {liveDataActions} from '../redux/sliceLiveData';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const liveDataSet = (
  ...args: Parameters<typeof liveDataActions.liveDataSet>
) => store.dispatch(liveDataActions.liveDataSet(...args));

export const liveDataClear = (
  ...args: Parameters<typeof liveDataActions.liveDataClear>
) => store.dispatch(liveDataActions.liveDataClear(...args));
