import {cleaningActions} from './sliceOrder';
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

// DO NOT CHANGE TYPE -> TYPE CHECK WILL NOT WORK
export const mergeSession = (args: DeepPartial<Session>) => {
  store.dispatch(sessionActions.mergeSession(args));
};

// DO NOT CHANGE TYPE -> TYPE CHECK WILL NOT WORK
export const mergeLocal = (args: DeepPartial<TypeLocal>) => {
  store.dispatch(localActions.mergeLocal(args));
};

// DO NOT CHANGE TYPE -> TYPE CHECK WILL NOT WORK
export const mergeOrder = (args: DeepPartial<TypeOrder>) => {
  store.dispatch(cleaningActions.mergeOrder(args));
};
// DO NOT CHANGE TYPE -> TYPE CHECK WILL NOT WORK
export const mergeObject = (args: DeepPartial<TypeObject>) => {
  console.log(args);
  store.dispatch(actionObject.mergeObject(args));
};

export const logout = () => {
  mergeSession(sessionInitialState);
  navigate('HomeExt', {});
  store.dispatch(cleaningActions.setOrderFormInit());
};

export const showSnackbar = ({
  value = true,
  text,
}: TypeLocal['snackbarVisible']) => {
  mergeLocal({snackbarVisible: {value, text}});
};

export const setOrderFormInit = () => {
  store.dispatch(cleaningActions.setOrderFormInit());
};
