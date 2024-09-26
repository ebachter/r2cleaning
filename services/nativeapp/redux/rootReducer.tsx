import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {combineReducers} from 'redux';
import {requestReducers} from './sliceRequest';
import {sessionReducers} from './sliceSession';
import {reducerObject} from './sliceObject';
import {localReducers} from './sliceLocal';
import {offerReducer} from './sliceOffer';

const rootReducer = combineReducers({
  request: requestReducers,
  offer: offerReducer,
  session: sessionReducers,
  object: reducerObject,
  local: localReducers,
});

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: [],
};

type RootReducer = ReturnType<typeof rootReducer>;

export default persistReducer<RootReducer>(rootPersistConfig, rootReducer);
