import {requestActions} from './sliceRequest';
import {sessionActions, sessionInitialState} from './sliceSession';
import {store} from './store';
import {Session} from '../types/typeSession';
import {navigate} from '../RootNavigation';
import {actionObject} from './sliceObject';
import {DeepPartial} from '../types/typeUtils';
import {TypeLocal} from '../types/typeLocal';
import {localActions} from './sliceLocal';
import {TypeOrder} from '../types/typeOrder';
import {TypeObject} from '../types/typeObject';
import {offerActions} from './sliceOffer';
import {TypeOffer} from '../types/typeOffer';

// DO NOT CHANGE TYPE -> TYPE CHECK WILL NOT WORK
export const mergeSession = (args: DeepPartial<Session>) => {
  console.log('mergeSession', args);
  store.dispatch(sessionActions.mergeSession(args));
};

export const mergeLocal = (args: DeepPartial<TypeLocal>) => {
  store.dispatch(localActions.mergeLocal(args));
};

export const mergeOrder = (args: DeepPartial<TypeOrder>) => {
  store.dispatch(requestActions.mergeOrder(args));
};

export const mergeOffer = (args: DeepPartial<TypeOffer>) => {
  store.dispatch(offerActions.mergeOffer(args));
};

export const mergeObject = (args: DeepPartial<TypeObject>) => {
  console.log(args);
  store.dispatch(actionObject.mergeObject(args));
};

export const logout = () => {
  mergeSession(sessionInitialState);
  navigate('HomeExt', {});
  store.dispatch(requestActions.setOrderFormInit());
};

export const showSnackbar = ({
  value = true,
  text,
}: TypeLocal['snackbarVisible']) => {
  mergeLocal({snackbarVisible: {value, text}});
};

export const setOrderFormInit = () => {
  store.dispatch(requestActions.setOrderFormInit());
};
