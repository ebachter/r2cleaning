import {PayloadAction} from '@reduxjs/toolkit';
import {cleaningActions} from './sliceCleaning';
import {sessionActions} from './sliceSession';
import {store} from './store';
import {Session} from '../types/typeSession';
import {Cleaning} from '@remrob/mysql';

export const setObjectType = (
  ...args: Parameters<typeof cleaningActions.setObjectType>
) => store.dispatch(cleaningActions.setObjectType(...args));

export const setRoomNumberOfAppartment = (
  ...args: Parameters<typeof cleaningActions.setRoomNumberOfAppartment>
) => store.dispatch(cleaningActions.setRoomNumberOfAppartment(...args));

export const setKitchenOfAppartment = (
  ...args: Parameters<typeof cleaningActions.setKitchenOfAppartment>
) => store.dispatch(cleaningActions.setKitchenOfAppartment(...args));

export const setBathroomOfAppartment = (
  ...args: Parameters<typeof cleaningActions.setBathroomOfAppartment>
) => store.dispatch(cleaningActions.setBathroomOfAppartment(...args));

export const setAddress = (
  ...args: Parameters<typeof cleaningActions.setAdress>
) => store.dispatch(cleaningActions.setAdress(...args));

export const setCity = (...args: Parameters<typeof cleaningActions.setCity>) =>
  store.dispatch(cleaningActions.setCity(...args));

export const setPhone = (...args) =>
  store.dispatch(cleaningActions.setPhone(...args));

export const setOrder = (args: Partial<Cleaning['order']>) =>
  store.dispatch(cleaningActions.setOrder(args));

export const setModals = (args: Partial<Cleaning['modals']>) =>
  store.dispatch(cleaningActions.setModals(args));

// ///////////////////////////////////////////////
export const sessionSet = (
  ...args: Parameters<typeof sessionActions.sessionSet>
) => {
  store.dispatch(sessionActions.sessionSet(...args));
  setModals({login: false, signup: false});
  setOrder({smsSent: false});
};
