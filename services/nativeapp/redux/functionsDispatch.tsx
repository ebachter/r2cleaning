import {cleaningActions} from './sliceCleaning';
import {store} from './store';

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
