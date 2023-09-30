import {enqueueSnackbar} from 'notistack';
import {getAppState} from '../redux/store';
import {trpcFunc} from '../trpc';
import {
  closePopup,
  setAppPopup,
  setPopup,
  setPopupElementOptions,
} from '../zustand/popup';

export const popupObjectAlertConnection = (
  objectId: number,
  alertType: 'email' | 'push',
  onEvent: 'onConnect' | 'onDisconnect',
  value: boolean,
  refetch: () => void,
) =>
  setPopup({
    open: true,
    mandatory: true,
    header: `Connection alert`,
    content: [
      {
        type: 'info',
        bodyText: `Do you want to switch ${
          value ? 'on' : 'off'
        } ${onEvent} notification?`,
      },
    ],
    buttons: [
      {type: 'cancel', labelText: 'Close'},
      {
        type: 'confirmWithInput',
        elemKey: 'setButton',
        labelText: 'Confirm',
        variant: 'outlined',
        onClick: async () => {
          await trpcFunc.fnSetOnoffAlert.mutate({
            objectId,
            alertType,
            onEvent,
            value,
          });
          refetch();
          closePopup();
        },
      },
    ],
  });

export const popupObjectSensorAlertAdd = (
  objectId: number,
  refetch: () => void,
) => {
  const sensors =
    getAppState().objects[objectId]?.models?.json_model_full.sensors || [];
  const lang = getAppState().user.language;

  setAppPopup(['sensorid', 'moreless', 'switchToggle', 'switchVal'])({
    open: true,
    mandatory: true,
    header: `Add sensor alert`,
    content: [
      {
        type: 'info',
        bodyText: `Sensor Alert informs you when a defined limit is exeeded`,
      },

      {
        type: 'dialogSelect',
        elemKey: 'sensorid',
        // visible: false,
        value: '',
        label: 'Sensor',
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('sensorid', val);
        },
        options: Object.entries(sensors || {}).map(([id, sensorData]) => ({
          id,
          label: sensorData.name[lang],
        })),
      },

      {
        type: 'dialogToggle',
        elemKey: 'switchToggle',
        switchOption1: {
          id: 'less',
          freeSwitchLabel: 'Less',
        },
        switchOption2: {
          id: 'greater',
          freeSwitchLabel: 'Greater',
        },
        value: 'less',

        onElementUpdate: (
          value,
          {setPopupElementVisible, setPopupElementValue},
        ) => {
          setPopupElementValue('switchToggle', value);
          /* if (format === 'less') {
            //setPopupElementVisible('path', false);
          }
          if (format === 'more') {
            //setPopupElementVisible('path', true);
          } */
        },
      },
      {
        type: 'input',
        elemKey: 'switchVal',
        labelText: 'Value',
        value: '',
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('switchVal', val);
        },
      },
    ],

    buttons: [
      {type: 'cancel', labelText: 'Close'},
      {
        type: 'confirmWithInput',
        elemKey: 'setButton',
        labelText: 'Confirm',
        variant: 'outlined',
        onClick: async (elementValues) => {
          await trpcFunc.fnsSensorAlertAdd.mutate({
            type: 'addSensorAlert',
            objectId,
            sensorId: elementValues.sensorid,
            sign: elementValues.switchToggle ? 'greater' : 'less',
            value: Number(elementValues.switchVal),
            email: true,
            push: false,
          });

          refetch();
          closePopup();
        },
      },
    ],
  });
};

export const popupObjectAlertSensorDel = (
  objectId: number,
  sensorId: string,
  sign: boolean,
  refetch: () => void,
) =>
  setPopup({
    header: 'Delete sensor alert',
    content: [
      {
        type: 'info',
        bodyText: `Do you reallly want to delete the sensor alert?`,
      },
    ],
    buttons: [
      {type: 'close'},
      {
        type: 'confirmWithInput',
        onClick: async () => {
          await trpcFunc.fnsSensorAlertDel.mutate({
            objectId,
            sensorId,
            sign: sign ? 'greater' : 'less',
          });
          enqueueSnackbar('Sensor alert deleted', {
            variant: 'success',
          });
          refetch();
          closePopup();
        },
      },
    ],
  });

export const popupObjectAlertSwitchDel = (
  objectId: number,
  switchId: string,
  stateId: string,
  refetch: () => void,
) =>
  setPopup({
    header: 'Delete switch alert',
    content: [
      {
        type: 'info',
        bodyText: `Do you reallly want to delete the switch alert?`,
      },
    ],
    buttons: [
      {type: 'close'},
      {
        type: 'confirmWithInput',
        variant: 'outlined',
        onClick: async () => {
          await trpcFunc.appActorAlertDel.mutate({
            objectId,
            switchId,
            stateId,
          });
          enqueueSnackbar('Switch alert deleted', {
            variant: 'success',
          });
          refetch();
          closePopup();
        },
      },
    ],
  });

// ///////////////////////////////////
export const popupObjectSwitchAlertAdd = (
  objectId: number,
  refetch: () => void,
) => {
  const switches =
    getAppState().objects[objectId]?.models?.json_model_full.switches || {};
  const lang = getAppState().user.language;

  setAppPopup(['switchId', 'stateId'])({
    open: true,
    mandatory: true,
    header: `Add switch alert`,
    content: [
      {
        type: 'info',
        bodyText: `Notification in case of the specified switch status`,
      },

      {
        type: 'dialogSelect',
        elemKey: 'switchId',
        value: '',
        label: 'Switch',
        options: Object.entries(switches || {}).map(([id, switchData]) => ({
          id,
          label: switchData.name[lang],
        })),
        setOnChange: (selectedSwitchId, {setPopupElementValue}) => {
          setPopupElementValue('switchId', selectedSwitchId);

          const states = Object.entries(
            selectedSwitchId ? switches[selectedSwitchId].states : {},
          ).map(([id, stateData]) => ({
            id,
            label: stateData.name[lang],
          }));
          setPopupElementOptions('stateId', states);
        },
      },

      {
        type: 'dialogSelect',
        elemKey: 'stateId',
        // visible: false,
        value: '',
        label: 'State',
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('stateId', val);
        },
        options: Object.entries({}).map(([id, sensorData]) => ({
          id,
          label: 'sensorData.name[lang]',
        })),
      },
    ],

    buttons: [
      {type: 'cancel', labelText: 'Close'},
      {
        type: 'confirmWithInput',
        elemKey: 'setButton',
        labelText: 'Confirm',
        variant: 'outlined',
        onClick: async (elementValues) => {
          if (elementValues.switchId && elementValues.stateId) {
            await trpcFunc.appActorAlertAdd.mutate({
              objectId: objectId,
              switchId: elementValues.switchId,
              stateId: elementValues.stateId,
              value: new Set(['email', 'push']),
            });
            refetch();
          }

          closePopup();
        },
      },
    ],
  });
};
// ///////////////////////////////////
export const popupObjectButtonAlertAdd = (
  objectId: number,
  refetch: () => void,
) => {
  const buttons =
    getAppState().objects[objectId]?.models?.json_model_full.buttons || {};
  const lang = getAppState().user.language;

  setAppPopup(['buttonId', 'stateId'])({
    open: true,
    mandatory: true,
    header: `Add button alert`,
    content: [
      {
        type: 'info',
        bodyText: `Notification in case of the specified button status`,
      },
      {
        type: 'dialogSelect',
        elemKey: 'buttonId',
        value: '',
        label: 'Button',
        options: Object.entries(buttons || {}).map(([id, switchData]) => ({
          id,
          label: switchData.name[lang],
        })),
        setOnChange: (selectedButtonId, {setPopupElementValue}) => {
          setPopupElementValue('buttonId', selectedButtonId);

          const states = Object.entries(
            selectedButtonId ? buttons[selectedButtonId].states : {},
          ).map(([id, stateData]) => ({
            id,
            label: stateData.name[lang],
          }));
          setPopupElementOptions('stateId', states);
        },
      },

      {
        type: 'dialogSelect',
        elemKey: 'stateId',
        // visible: false,
        value: '',
        label: 'State',
        setOnChange: (val, {setPopupElementValue}) => {
          setPopupElementValue('stateId', val);
        },
        options: Object.entries({}).map(([id, sensorData]) => ({
          id,
          label: 'sensorData.name[lang]',
        })),
      },
    ],

    buttons: [
      {type: 'cancel', labelText: 'Close'},
      {
        type: 'confirmWithInput',
        elemKey: 'setButton',
        labelText: 'Confirm',
        variant: 'outlined',
        onClick: async (elementValues) => {
          if (elementValues.buttonId && elementValues.stateId) {
            await trpcFunc.appButtonAlertAdd.mutate({
              objectId: objectId,
              buttonId: elementValues.buttonId,
              stateId: elementValues.stateId,
              value: new Set(['email', 'push']),
            });
            refetch();
          }

          closePopup();
        },
      },
    ],
  });
};

export const popupObjectAlertButtonDel = (
  objectId: number,
  buttonId: string,
  stateId: string,
  refetch: () => void,
) =>
  setPopup({
    header: 'Delete switch alert',
    content: [
      {
        type: 'info',
        bodyText: `Do you reallly want to delete the switch alert?`,
      },
    ],
    buttons: [
      {type: 'close'},
      {
        type: 'confirmWithInput',
        variant: 'outlined',
        onClick: async () => {
          await trpcFunc.appButtonAlertDel.mutate({
            objectId,
            buttonId,
            stateId,
          });
          enqueueSnackbar('Button alert deleted', {
            variant: 'success',
          });
          refetch();
          closePopup();
        },
      },
    ],
  });
