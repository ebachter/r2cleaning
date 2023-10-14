import {combineReducers, AnyAction} from 'redux';
import {persistReducer} from 'redux-persist'; // persistStore,
import storage from 'redux-persist/lib/storage';
// import languageProviderReducer from 'containers/LanguageProvider/reducer';
import {sessionReducers} from './sliceSession';
import {projectsReducers} from './sliceProjects';
import {contactsReducers} from './sliceContacts';
import {objectsReducers} from './sliceObjects';
import {widgetsReducers} from './sliceWidgets';
import {servicesReducers} from './sliceServices';
import {userReducers} from './sliceUser';
import {searchUsersReducers} from './sliceSearch';
import {liveDataReducers} from './sliceLiveData';
import {cleaningReducers} from './sliceCleaning';

// WHITELIST
const persistConfig = {
  key: 'r2meta',
  storage: storage,
  whitelist: [
    'session',
    'projects',
    'contacts',
    'objects',
    'widgets',
    'user',
    'models',
    'services',
  ],
};

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */

export default function createReducer() {
  const rootReducer = combineReducers({
    // language: languageProviderReducer,
    session: sessionReducers,
    projects: projectsReducers,
    contacts: contactsReducers,
    objects: objectsReducers,
    widgets: widgetsReducers,
    services: servicesReducers,
    user: userReducers,
    search: searchUsersReducers,
    live: liveDataReducers,
    cleaning: cleaningReducers,
  });

  type RootReducer = ReturnType<typeof rootReducer>;

  const persistedReducer = persistReducer<RootReducer, AnyAction>(
    persistConfig,
    rootReducer,
  );

  return persistedReducer;
}
