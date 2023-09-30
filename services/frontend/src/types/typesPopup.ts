// import {Color} from '@mui/lab';
// import {Color} from './typesColor';

export type PopupContentInfo = {
  type: 'info' | 'success' | 'warning' | 'error';
  elemKey?: string;
  bodyText: string;
  params?: {[key: string | number]: string};
  visible?: boolean;
};

export type PopupContentColor = {
  type: 'color';
  elemKey: string;
  value?: string;
  visible?: boolean;
  onChange?: (
    color: string,
    {
      setPopupElementValue,
      popupValues,
    }: {
      setPopupElementValue: (key: string, val: any) => void;
      popupValues: {key: string; val: any};
    },
  ) => void;
};

export type PopupContentUpload = {
  elemKey: string;
  type: 'upload';
  visible?: boolean;
};

export type PopupContentFile = {
  type: 'file';
  name: string;
  elemKey: string;
  value: string;
  visible?: boolean;
  setOnChange?: (
    v: string,
    {
      setPopupElementValue,
      popupValues,
    }: {
      setPopupElementValue: (key: string, val: any) => void;
      popupValues: {key: string; val: any};
    },
  ) => void;
};

export type PopupInputEndIcons = null | 'Done' | 'Error';

export type PopupContentInput = {
  type: 'input';
  elemKey: string;
  labelText: string;
  defaultValue?: string; // is required???
  multiline?: {maxRows: number} | {rows: number};
  visible?: boolean;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  setOnChange?: (
    val: string,
    {
      setPopupElementValue,
      setPopupElementError,
    }: {
      setPopupElementValue: (key: string, val: any) => void;
      setPopupElementError: (key: string, val: any) => void;
    },
  ) => void;
  endIcon?: PopupInputEndIcons;
  password?: boolean;
  errorText?: string;
};

export type PopupContentDialogSelect = {
  type: 'dialogSelect';
  elemKey: string;
  label: string;
  options: PopupElementOptions[];
  visible?: boolean;
  value?: string;
  setOnChange?: (
    v: string,
    {
      setPopupElementValue,
      popupValues,
      setPopupElementOptions,
      setPopupElementVisible,
    }: {
      setPopupElementValue: (key: string, val: any) => void;
      setPopupElementVisible: (key: string, val: any) => void;
      popupValues: {[key: string]: any};
      setPopupElementOptions: (
        k: string,
        v: PopupElementOptions[], // {id: string; label: string; color: string}[]
      ) => void;
    },
  ) => void;
};

export type PopupContentDialogTabs = {
  type: 'dialogTabs';
  elemKey: string;
  value: string;
  dialogTabItems: {id: string; freeText: string}[];
  onElementUpdate: (
    val: string,
    {
      setPopupElementValue,
      setPopupElementVisible,
    }: // setDisabled,
    {
      setPopupElementValue: (k: string, v: string | boolean) => void;
      setPopupElementVisible: (k: string, v: boolean) => void;
      // setDisabled: (k: string, v: string) => void;
    },
  ) => void;
};

export type PopupContentDialogRadio = {
  type: 'dialogRadio';
  elemKey: string;
  value: string;
  radioOptions: {id: string; freeRadioLabel: string}[];
  visible?: boolean;
  onElementUpdate: (
    value: string,
    {
      setPopupElementValue,
      setPopupElementVisible,
    }: {
      setPopupElementValue: (k: string, v: string | boolean) => void;
      setPopupElementVisible: (k: string, v: boolean) => void;
    },
  ) => void;
};

export type PopupContentDialogSwitch = {
  type: 'dialogToggle';
  elemKey: string;
  value: string;
  switchOption1: {
    id: string;
    freeSwitchLabel: string;
  };
  switchOption2: {
    id: string;
    freeSwitchLabel: string;
  };
  onElementUpdate: (
    value: string,
    {
      setPopupElementVisible,
      setPopupElementValue,
    }: {
      setPopupElementVisible: (id: string, value: boolean) => void;
      setPopupElementValue: (key: string, val: any) => void;
    },
  ) => void;
};

type PopupContentCountdown = {
  type: 'countdown';
  elemKey: string;
};

export type PopupElementOptions = {
  id: string;
  label: string;
  color?: string;
  onChange?: (val: {[k: string]: string}) => void;
  // value: string;
};

export type PopupContentDialogList = {
  type: 'dialogList';
  elemKey: string;
  labelText: string;
  options: PopupElementOptions[];
  value?: {[optionId: string]: string};
  visible?: boolean;
};

export type PopupOptions = {
  type: 'options';
  elemKey: string;
  value: {sign: 'greater' | 'less'; value: number} | null;
  setOnChange: ({
    sign,
    value,
  }: {
    sign?: '' | 'greater' | 'less';
    value?: string;
  }) => void;
  visible?: boolean;
};

export type PopupAutocommplete = {
  type: 'autocomplete';
  elemKey?: string;
  label: string;
  value?: string | null;
  initialValue?: string;
  options: PopupElementOptions[];
  setOnChange?: (
    val: string,
    {
      setPopupElementValue,
      setPopupElementError,
      setPopupElementOptions,
    }: {
      setPopupElementValue: (key: string, val: any) => void;
      setPopupElementError: (key: string, val: any) => void;
      setPopupElementOptions: (key: string, val: any) => void;
    },
  ) => void;
  errorText?: string;
  visible?: boolean;
};

export type PopupContentCheckbox = {
  type: 'checkbox';
  elemKey: string;
  label: string;
  value: boolean;
  disabled?: boolean;
  visible?: boolean;
  onChange?: (
    val: boolean,
    {
      setPopupElementValue,
      setPopupElementVisible,
    }: {
      setPopupElementValue: (key: string, val: any) => void;
      setPopupElementVisible: (key: string, val: any) => void;
    },
  ) => void;
};

export type PopupSectionHeader = {
  type: 'sectionHeader';
  elemKey?: string;
  visible?: boolean;
  text: string;
};

export type PopupContentImage = {
  type: 'image';
  elemKey?: string;
  imageString: string;
};

export type PopupContentButtons = {
  type: 'buttons';
  elemKey: string;
  visible?: boolean;
  buttons: {
    label: string;
    onClick: (
      p: {[k: string]: any},
      {
        setPopupElementValue,
        setPopupElementVisible,
      }: // setDisabled,
      {
        setPopupElementValue: (k: string, v: string | boolean) => void;
        setPopupElementVisible: (k: string, v: boolean) => void;
        // setDisabled: (k: string, v: string) => void;
      },
    ) => void;
  }[];
};

export type PopupContentJson = {
  type: 'json';
  elemKey?: string;
  visible?: boolean;
  value: string;
};

export type PopupContentMixArray = PopupContentMix[];

export type PopupContentMix = PopupContentArray[number];

export type PopupContentArray = [
  PopupContentInfo,
  PopupContentInput,
  PopupContentColor,
  PopupContentFile,
  PopupContentDialogSelect,
  PopupContentDialogTabs,
  PopupContentDialogRadio,
  PopupContentDialogSwitch,
  PopupContentUpload,
  PopupContentDialogList,
  PopupContentCountdown,
  PopupOptions,
  PopupAutocommplete,
  PopupContentCheckbox,
  PopupSectionHeader,
  PopupContentImage,
  PopupContentButtons,
  PopupContentJson,
];

export type PopupButtonConfirmWithInput = {
  type: 'confirmWithInput';
  elemKey?: string;
  labelText?: string;
  onClick?: (
    p: {
      [k: string]: any;
    },
    /* visibility: {
      [k: string]: any;
    }, */
  ) => void; // Promise<{onPopupSuccess: () => void} | void> | void;

  // disabledIfVisibleEmpty?: boolean;
  // disabledIfInputsInvalid?: boolean;
  // disabledIfEmpty?: boolean;
  disabled?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
};

type PopupButtonCancel = {
  type: 'cancel' | 'close';
  elemKey?: string;
  labelText?: string;
  disabled?: boolean;
  onButtonClick?: () => void;
};

export type PopupButtonFunction = {
  type: 'func';
  elemKey?: string;
  variant?: 'text' | 'outlined' | 'contained';
  labelText: string;
  func: {
    name: string;
    params: any;
    response: {
      status: {
        [s: number]: {
          setContent: {
            type: 'success';
            bodyText: {
              raw: `Alert successfully set`;
            };
          }[];
        };
      };
    };
  };
  disabled?: boolean;
};

export type PopupButtonMixArray = PopupButtonMix[];
export type PopupButtonMix =
  | PopupButtonCancel
  | PopupButtonConfirmWithInput
  | PopupButtonFunction;

export type Popup = {
  open?: boolean;
  header: string;
  mandatory?: boolean;
  headerFreeText?: string;

  loading?: boolean;
  content: PopupContentMixArray;
  buttons: PopupButtonMixArray;
  onPopupClose?: () => void;
};

export type PopupZustand = {
  data: Popup;
  setPopup: (data: Popup) => void;
  closePopup: () => void;
};
