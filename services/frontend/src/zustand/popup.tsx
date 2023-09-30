import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {
  Popup,
  PopupAutocommplete,
  PopupButtonConfirmWithInput,
  PopupButtonMix,
  PopupContentColor,
  PopupContentDialogRadio,
  PopupContentDialogSelect,
  PopupContentDialogSwitch,
  PopupContentInput,
  PopupContentMix,
  PopupInputEndIcons,
} from '../types/typesPopup';
import produce from 'immer';
import _ from 'lodash';

type PopupZustand = {
  data: Popup;
  setPopup: (data: Popup) => void;
  closePopup: () => void;
};

export const popupInitialState: Popup = {
  open: false,
  mandatory: false,
  header: '',
  headerFreeText: '',
  loading: false,
  content: [],
  buttons: [],
};

export const usePopupStore = create<PopupZustand>()(
  devtools(
    (set) => ({
      data: popupInitialState,

      closePopup: () =>
        set(
          produce((state) => {
            state.data = popupInitialState;
          }),
          true,
        ),

      setPopup: (data) =>
        set(
          produce((state) => {
            state.data = data;
          }),
        ),

      setPopupContent: (data: Popup['content']) =>
        set(
          produce((state) => {
            state.data.content = data;
          }),
        ),

      setPopupButtons: (data: Popup['buttons']) =>
        set(
          produce((state) => {
            state.data.buttons = data;
          }),
        ),
    }),
    {
      name: 'popup',
    },
  ),
);

// For Usage in JS functions (outside of components)
export function closePopup() {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      prev.data = popupInitialState;
    }),
  );
}

export function setPopup(data: Popup) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      prev.data = data;
    }),
  );
}

/* type OmitOwner<T = PopupContentMix> = T extends BaseAnimal ? Omit<T, 'owner'> : never;

type AnimalParams = OmitOwner & {
  owner: string
}; */

export const setAppPopup =
  <T extends string>(elements: T[]) =>
  (
    data: Omit<Popup, 'content' | 'buttons'> & {
      content: ((
        | Exclude<
            PopupContentMix,
            | {type: 'dialogToggle'}
            | {type: 'input'}
            | {type: 'dialogSelect'}
            | {type: 'color'}
            | {type: 'dialogRadio'}
          >
        | (Omit<PopupContentDialogRadio, 'onElementUpdate'> & {
            onElementUpdate?: (
              v: string,
              {
                setPopupElementValue,
                setPopupElementVisible,
                setDisabled,
                popupValues,
              }: {
                setPopupElementValue: (key: T, val: string) => void;
                setPopupElementVisible: (k: T, v: boolean) => void;
                setDisabled: (k: T, v: boolean) => void;
                popupValues: {[k in T]: string};
              },
            ) => void;
          })
        | (Omit<PopupContentColor, 'onChange'> & {
            onChange?: (
              v: string,
              {
                setPopupElementValue,
                popupValues,
              }: {
                setPopupElementValue: (key: T, val: any) => void;
                popupValues: {[k in T]: string};
              },
            ) => void;
          })
        | (Omit<PopupContentDialogSelect, 'setOnChange'> & {
            setOnChange?: (
              v: string,
              {
                setPopupElementValue,
                setPopupElementVisible,
                popupValues,
              }: {
                setPopupElementValue: (key: T, val: any) => void;
                setPopupElementVisible: (key: T, val: any) => void;
                popupValues: {[k in T]: string};
              },
            ) => void;
          })
        | (Omit<PopupContentDialogSwitch, 'onElementUpdate'> & {
            onElementUpdate: (
              val: string,
              {
                setPopupElementVisible,
                setPopupElementValue,
              }: {
                setPopupElementVisible: (k: T, v: boolean) => void;
                setPopupElementValue: (key: T, val: any) => void;
              },
            ) => void;
          })
        | (Omit<PopupContentInput, 'setOnChange'> & {
            setOnChange: (
              val: string,
              // setPopupElementValue: (key: T, val: any) => void,
              {
                setPopupElementValue,
                setPopupElementError,
              }: {
                setPopupElementValue: (key: T, val: any) => void;
                setPopupElementError: (key: T, val: any) => void;
              },
            ) => void;
          })
      ) & {elemKey?: T})[];
      buttons: (
        | Exclude<PopupButtonMix, {type: 'confirmWithInput'}>
        | (Omit<PopupButtonConfirmWithInput, 'onClick'> & {
            onClick?: (
              p: {
                [k in T]: any;
              },
              visibility: {
                [k in T]: any;
              },
            ) => void;
          })
      )[];
    },
  ) => {
    usePopupStore.setState(
      produce((prev: PopupZustand) => {
        prev.data = data as Popup;
      }),
    );
  };

export function setPopupContent(data: Popup['content']) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      prev.data.content = data;
    }),
  );
}

export function appendPopupContent(data: Popup['content']) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      prev.data.content.push(...data);
    }),
  );
}

export function setPopupButtons(data: Popup['buttons']) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      prev.data.buttons = data;
    }),
  );
}

export function delPopupContentElemByKey(key: string) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      prev.data.content = prev.data.content.filter(
        (o) => 'elemKey' in o && o.elemKey !== key,
      );
    }),
  );
}

export function getPopupContentElemKeys() {
  const keys = usePopupStore
    .getState()
    .data.content.map((o) => ('elemKey' in o ? o.elemKey : undefined))
    .filter((o): o is Exclude<typeof o, undefined> => o !== undefined);
  return keys;
}

export function setPopupElementValue(elemKey: string, value: any) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      const element = prev.data.content.find(
        (e) => 'elemKey' in e && e.elemKey === elemKey,
      );
      if (element) _.set(element, 'value', value);
      /* if (element && 'value' in element) {
        if (value === null) element.value = null;
        else
          element.value =
            typeof element.value === 'object' && typeof value === 'object'
              ? {...element.value, ...value}
              : value;
      } */
    }),
  );
}

export function setPopupElementError(elemKey: string, value: string) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      const element = prev.data.content.find(
        (e) => 'elemKey' in e && e.elemKey === elemKey,
      );
      if (element) _.set(element, 'errorText', value);
    }),
  );
}

export function setPopupElementDisabled(elemKey: string, value: boolean) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      const element = [...prev.data.content, ...prev.data.buttons].find(
        (e) => 'elemKey' in e && e.elemKey === elemKey,
      );
      if (element) {
        _.set(element, 'disabled', value);
      }
    }),
  );
}

export function setPopupElementVisible(elemKey: string, value: boolean) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      const element = prev.data.content.find(
        (e) => 'elemKey' in e && e.elemKey === elemKey,
      );
      if (element) {
        _.set(element, 'visible', value);
      }
    }),
  );
}

export function deleteAllPopupErrors() {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      prev.data.content.forEach((e, i) => {
        if (e.type === 'autocomplete') e.errorText = '';
      });
    }),
  );
}

export function getPopupElementValue(elemKey: string) {
  // : {sign: 'greater' | 'less'; value: number} | string | boolean | null
  const element = usePopupStore
    .getState()
    .data.content.find((o) => 'elemKey' in o && o.elemKey === elemKey);
  if (element && 'value' in element) {
    /*  type DT = {}
     if(element.type==='autocomplete') DT & PopupAutocommplete
     else DT & string */
    return element.value || null;
  }
  return null;
}

export function getPopupAllValues() {
  const values = usePopupStore
    .getState()
    .data.content.reduce(
      (n, o) =>
        'elemKey' in o && o.elemKey && 'value' in o
          ? {...n, [o.elemKey]: o.value}
          : n,
      {},
    );
  return values as any;
}

export function setPopupElementOptions(
  elemKey: string,
  options: PopupAutocommplete['options'],
) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      const element = prev.data.content.find(
        (e) => 'elemKey' in e && e.elemKey === elemKey,
      );
      if (element && 'options' in element) element.options = options;
    }),
  );
}

export function setPopupInputEndIcon(
  elemKey: string,
  icon: PopupInputEndIcons,
) {
  usePopupStore.setState(
    produce((prev: PopupZustand) => {
      const element = prev.data.content.find(
        (e) => 'elemKey' in e && e.elemKey === elemKey,
      );
      if (element && element.type === 'input') element.endIcon = icon;
    }),
  );
}
