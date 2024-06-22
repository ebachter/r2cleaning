import {cleaningActions} from './sliceOrder';
import {sessionActions, sessionInitialState} from './sliceSession';
import {store} from './store';
import {Session} from '../types/typeSession';
import {TypeOrder} from '@remrob/mysql';
import {navigate} from '../RootNavigation';
import {actionObject} from './sliceObject';
import {EntityObject} from '@remrob/db';
import {DeepPartial} from '../types/typeUtils';

// export const setObjectType = (
//   ...args: Parameters<typeof cleaningActions.setObjectType>
// ) => store.dispatch(cleaningActions.setObjectType(...args));

export const setRoomNumberOfAppartment = (
  ...args: Parameters<typeof cleaningActions.setRoomNumberOfAppartment>
) => store.dispatch(cleaningActions.setRoomNumberOfAppartment(...args));

export const setKitchenOfAppartment = (
  ...args: Parameters<typeof cleaningActions.setKitchenOfAppartment>
) => store.dispatch(cleaningActions.setKitchenOfAppartment(...args));

export const setBathroomOfAppartment = (
  ...args: Parameters<typeof cleaningActions.setBathroomOfAppartment>
) => store.dispatch(cleaningActions.setBathroomOfAppartment(...args));

// export const setAddress = (
//   ...args: Parameters<typeof cleaningActions.setAdress>
// ) => store.dispatch(cleaningActions.setAdress(...args));

// export const setCity = (...args: Parameters<typeof cleaningActions.setCity>) =>
//   store.dispatch(cleaningActions.setCity(...args));

// export const setPhone = (...args) =>
//   store.dispatch(cleaningActions.setPhone(...args));

export const setOrder = (args: Partial<TypeOrder>) =>
  store.dispatch(cleaningActions.setOrder(args));

// export const setModals = (args: Partial<Cleaning['modals']>) =>
//  store.dispatch(cleaningActions.setModals(args));

// ///////////////////////////////////////////////
/* export const sessionSet = (
  ...args: Parameters<typeof sessionActions.sessionSet>
) => {
  store.dispatch(sessionActions.sessionSet(...args));
  // setModals({login: false, signup: false});
  // setOrder({smsSent: false});
}; */

// DO NOT CHANGE TYPE -> TYPE CHECK WILL NOT WORK
export const mergeSession = (args: DeepPartial<Session>) => {
  store.dispatch(sessionActions.mergeSession(args));
};

// DO NOT CHANGE TYPE -> TYPE CHECK WILL NOT WORK
export const mergeOrder = (args: DeepPartial<TypeOrder>) => {
  store.dispatch(cleaningActions.mergeOrder(args));
};

export const logout = () => {
  mergeSession(sessionInitialState);
  navigate('HomeExt', {});
  store.dispatch(cleaningActions.setCleaningInit());
};

export const showSnackbar = ({
  value = true,
  text,
}: Session['snackbarVisible']) => {
  store.dispatch(sessionActions.showSnackbar({value, text}));
};

export const setOrderFormInit = () => {
  store.dispatch(cleaningActions.setOrderFormInit());
};

export const setObjectNew = (
  args: Partial<Omit<EntityObject, 'object_id'>>,
) => {
  store.dispatch(actionObject.setObject(args));
};
