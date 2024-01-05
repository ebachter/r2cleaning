import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

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
};

export default persistReducer(rootPersistConfig, rootReducer);
