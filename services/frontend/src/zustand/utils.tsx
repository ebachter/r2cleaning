import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import produce from 'immer';

type UtilsZustandData = {
  subscription: {
    subscriptionStatus: boolean;
    subscriptionLoading: boolean;
    subscriptionData: any;
  };
  globalLoadingIndicator: boolean;
  widgetFullscreen: boolean;
  // notifications: [];
  fingerprint: string | null;
  searchString: string;
  filterString: string;
  iframe_fifo: any;
  chatImage: string | null;
};

type UtilsZustand = {
  data: UtilsZustandData;
  setGlobalLoadingIndicator: (value: boolean) => void;
  resetUtils: () => void;
};

//  export const utilsInitialState: UtilsZustandData = {};
export const utilsInitialState: UtilsZustandData = {
  subscription: {
    subscriptionStatus: false,
    subscriptionLoading: false,
    subscriptionData: null,
  },
  globalLoadingIndicator: false,
  widgetFullscreen: false,
  fingerprint: null,
  searchString: '',
  filterString: '',
  iframe_fifo: null,
  chatImage: null,
};

export const useUtilsStore = create<UtilsZustand>()(
  devtools(
    (set) => ({
      data: utilsInitialState,
      resetUtils: () =>
        set(
          produce((state) => {
            state.data = utilsInitialState;
          }),
          true,
        ),
      setGlobalLoadingIndicator: (value) =>
        set(
          produce((state) => {
            state.data.globalLoadingIndicator = value;
          }),
        ),
    }),
    {
      name: 'utils',
      serialize: {options: true},
    },
  ),
);

// For Usage in JS functions (outside of components)
export function getGlobalLoadingIndicator() {
  return useUtilsStore.getState().data.globalLoadingIndicator;
}

export function getFingerprint() {
  return useUtilsStore.getState().data.fingerprint;
}

export function setFingerprint(value: string | null) {
  useUtilsStore.setState(
    produce((prev: UtilsZustand) => {
      prev.data.fingerprint = value;
    }),
  );
}

export function setGlobalLoadingIndicator(value: boolean) {
  useUtilsStore.setState(
    produce((prev: UtilsZustand) => {
      prev.data.globalLoadingIndicator = value;
    }),
  );
}

export function setWidgetFullScreen(value: boolean) {
  useUtilsStore.setState(
    produce((prev: UtilsZustand) => {
      prev.data.widgetFullscreen = value;
    }),
  );
}

export function setSearchString(value: string) {
  useUtilsStore.setState(
    produce((prev: UtilsZustand) => {
      prev.data.searchString = value;
    }),
  );
}

export function setFilterString(value: string) {
  useUtilsStore.setState(
    produce((prev: UtilsZustand) => {
      prev.data.filterString = value;
    }),
  );
}

export function resetUtils() {
  useUtilsStore.setState(
    produce((prev: UtilsZustand) => {
      prev.data = utilsInitialState;
    }),
  );
}

export function getUtils() {
  return useUtilsStore.getState().data;
}

export function setIframeFifo(value: any) {
  useUtilsStore.setState(
    produce((prev: UtilsZustand) => {
      prev.data.iframe_fifo = value;
    }),
  );
}

export function setChatImage(value: string | null) {
  useUtilsStore.setState(
    produce((prev: UtilsZustand) => {
      prev.data.chatImage = value;
    }),
  );
}
