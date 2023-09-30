import {configureStore} from '@reduxjs/toolkit';
import {
  persistStore,
  // FLUSH,
  // REHYDRATE,
  // PAUSE,
  // PERSIST,
  // PURGE,
  // REGISTER,
} from 'redux-persist';

import createReducer from './reducers';

const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // thunk: false,
      /* serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }, */
      serializableCheck: false,
    }),
  // enhancers,
});

export {store};
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

let persistor = persistStore(store);
export {persistor};

export const getAppState = () => store.getState();

export function getServicesByObject(objectId: number) {
  const all = getAppState().services;
  const objectServices = Object.entries(all).reduce((n, [serviceId, o]) => {
    if (Number(o.object_fk) === Number(objectId))
      n.push({serviceId: Number(serviceId), ...o});
    return n;
  }, [] as ({serviceId: number} & RootState['services'][number])[]);
  return objectServices;
}
