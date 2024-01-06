import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {combineReducers} from 'redux';
import {cleaningReducers} from './sliceCleaning';
import {sessionReducers} from './sliceSession';

const rootReducer = combineReducers({
  cleaning: cleaningReducers,
  session: sessionReducers,
});

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['session'],
};

type RootReducer = ReturnType<typeof rootReducer>;

export default persistReducer<RootReducer>(rootPersistConfig, rootReducer);
