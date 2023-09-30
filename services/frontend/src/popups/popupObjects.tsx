import {callAppObjectsLoad} from '../utils/trpcCalls';
import {
  closePopup,
  getPopupAllValues,
  setPopup,
  setPopupButtons,
  setPopupContent,
  setPopupElementDisabled,
  setPopupElementValue,
} from '../zustand/popup';
import {Popup, PopupContentCheckbox} from '../types/typesPopup';
import {trpcFunc} from '../trpc';
import history from '../redux/history';
import {enqueueSnackbar} from 'notistack';
import {getAppState} from '../redux/store';

export const popupObjectSettingsPublic = ({
  objectId,
  refetch,
}: {
  objectId: number;
  refetch: () => void;
}) => {
  const objectData = getAppState().objects[objectId]?.models.json_model_full;
  const switches: PopupContentCheckbox[] = Object.entries(
    objectData.switches || {},
  ).map(([id]) => ({
    type: 'checkbox',
    elemKey: `switch:${id}`,
    label: id,
    value: false,
    onChange: (val: boolean) => {
      setPopupElementValue(`switch:${id}`, val);
    },
  }));
  const sensors: PopupContentCheckbox[] = Object.entries(
    objectData.sensors || {},
  ).map(([id]) => ({
    type: 'checkbox',
    elemKey: `sensor:${id}`,
    label: id,
    value: false,
    onChange: (val: boolean) => {
      setPopupElementValue(`sensor:${id}`, val);
    },
  }));

  setPopup({
    open: true,
    mandatory: true,
    header: 'Set public',
    loading: false,
    content: [
      {
        type: 'info',
        elemKey: 'info',
        bodyText: `Select elements for public availibility?`,
      },
      {
        type: 'dialogSelect',
        elemKey: 'mode',
        label: 'Set mode',
        value: '',
        visible: true,
        options: [
          {id: 'private', label: 'Private'},
          {id: 'public', label: 'Public'},
        ],
        setOnChange: (val) => {
          setPopupElementValue('mode', val);
          if (val === 'private') {
            Object.keys(objectData.switches || {}).forEach((id) => {
              setPopupElementValue(`switch:${id}`, false);
              setPopupElementDisabled(`switch:${id}`, true);
            });
            Object.keys(objectData.sensors || {}).forEach((id) => {
              setPopupElementValue(`sensor:${id}`, false);
              setPopupElementDisabled(`sensor:${id}`, true);
            });
          } else {
            Object.keys(objectData.switches || {}).forEach((id) => {
              setPopupElementDisabled(`switch:${id}`, false);
            });
            Object.keys(objectData.sensors || {}).forEach((id) => {
              setPopupElementDisabled(`sensor:${id}`, false);
            });
          }
        },
      },
      {
        type: 'sectionHeader',
        text: `Switches`,
      },
      ...switches,
      {
        type: 'sectionHeader',
        text: `Sensors`,
      },
      ...sensors,
    ],
    buttons: [
      {type: 'close', elemKey: 'closeButton'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirm',
        labelText: 'Confirm',
        variant: 'outlined',
        onClick: async (elementValues) => {
          const vals = getPopupAllValues();
          if (!vals.mode) {
            enqueueSnackbar(`Publicity mode is not selected`, {
              variant: 'error',
            });
            return;
          }

          const switches = [];
          const sensors = [];

          for (const elemKey in vals) {
            if (elemKey.startsWith('switch:') && vals[elemKey]) {
              switches.push(elemKey.substring(7));
            }
            if (elemKey.startsWith('sensor:') && vals[elemKey]) {
              sensors.push(elemKey.substring(7));
            }
          }

          await trpcFunc.trpcAppObjectPublicSet.mutate({
            objectId,
            publicType: vals.mode,
            switches,
            sensors,
          });
          // callAppObjectsLoad();
          refetch();
          closePopup();
          enqueueSnackbar(`Publicity is set`, {variant: 'success'});
        },
      },
    ],
  });
};

export const popupObjectLogDataDel = ({
  objectId,
  name,
}: {
  objectId: number;
  name: string;
}) =>
  setPopup({
    open: true,
    mandatory: true,
    header: 'Delete log data',
    loading: false,
    content: [
      {
        type: 'info',
        elemKey: 'info',
        bodyText: `Do you want to delete the log data of [${objectId}]: ${name}?`,
      },
    ],
    buttons: [
      {type: 'close', elemKey: 'closeButton'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirm',
        labelText: 'Confirm',
        variant: 'outlined',
        onClick: async () => {
          await trpcFunc.trpcAppObjectDataDel.mutate({objectId});
          // await callAppObjectsLoad();
          enqueueSnackbar(`Log data deleted`, {variant: 'success'});

          closePopup();
        },
      },
    ],
  });

export const popupObjectDel = ({
  objectId,
  name,
}: {
  objectId: number;
  name: string;
}): Popup => {
  return {
    open: true,
    mandatory: true,
    header: 'Delete object',
    loading: false,
    content: [
      {
        type: 'info',
        elemKey: 'info',
        bodyText: `Do you want to delete the object [${objectId}]: ${name}?`,
      },
    ],
    buttons: [
      {type: 'close', elemKey: 'closeButton'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirm',
        labelText: 'Confirm',
        variant: 'outlined',
        onClick: async () => {
          await trpcFunc.appObjectDeregister.mutate(objectId);
          history.replace('/objects');
          callAppObjectsLoad();
          closePopup();
        },
      },
    ],
  };
};

export const objectPwdResetPopupIni = ({
  objectId,
}: {
  objectId: number;
}): Popup => ({
  open: true,
  mandatory: true,
  header: 'Reset object password',
  loading: false,
  content: [
    {
      type: 'info',
      elemKey: 'info',
      bodyText: `Enter new password for object ${objectId}`,
    },
    {
      type: 'input',
      password: true,
      labelText: 'Password',
      elemKey: 'password',
    },
  ],
  buttons: [
    {type: 'close', elemKey: 'close'},

    {
      type: 'confirmWithInput',
      elemKey: 'confirm',
      labelText: 'Reset',
      onClick: async ({password}) => {
        await trpcFunc.trpcAppObjectSettingsUpdate.mutate({
          objectId,
          oper: 'updateObjectPassword',
          password,
        });
        closePopup();
      },
    },
  ],
});

export const popupObjectProvisionAdd = (objectId: number, objectName: string) =>
  setPopup({
    open: true,
    mandatory: true,
    header: 'Add porovision',
    loading: false,
    content: [
      {
        type: 'info',
        elemKey: 'info',
        bodyText: `Create a new new provision for object [${objectId}] ${objectName}`,
      },
      {
        type: 'input',
        labelText: 'MQTT Client ID',
        elemKey: 'mqttClientId',
      },
      {
        type: 'input',
        labelText: 'Model ID',
        elemKey: 'slaveModelId',
      },
      {
        type: 'input',
        labelText: 'Label',
        elemKey: 'label',
      },
      {
        type: 'input',
        password: true,
        labelText: 'Password',
        elemKey: 'password',
      },
    ],
    buttons: [
      {type: 'close', elemKey: 'close'},
      {
        type: 'confirmWithInput',
        elemKey: 'confirm',
        labelText: 'Add',
        variant: 'outlined',
        onClick: async ({mqttClientId, label, slaveModelId, password}) => {
          await trpcFunc.trpcAppObjectProvisionAdd.mutate({
            objectId,
            mqttClientId,
            slaveModelId,
            label,
            password,
          });
          return {
            onPopupSuccess: () => {
              callAppObjectsLoad();
              setPopupContent([
                {
                  type: 'success',
                  bodyText: `Provision successfully created`,
                },
              ]);
              setPopupButtons([{type: 'close'}]);
            },
          };
        },
      },
    ],
  });
export const popupObjectProvisionDel = (
  objectId: number,
  provisionId: number,
) =>
  setPopup({
    open: true,
    mandatory: true,
    header: 'Delete porovision',
    loading: false,
    content: [
      {
        type: 'info',
        elemKey: 'info',
        bodyText: `Do you want to delete provision [${provisionId}]?`,
      },
    ],
    buttons: [
      {type: 'close'},

      {
        type: 'confirmWithInput',
        elemKey: 'confirm',
        labelText: 'Delete',
        variant: 'outlined',
        onClick: async () => {
          await trpcFunc.trpcAppObjectProvisionDel.mutate({
            objectId,
            provisionId,
          });
          return {
            onPopupSuccess: () => {
              callAppObjectsLoad();
              setPopupContent([
                {
                  type: 'success',
                  bodyText: `Provision deleted`,
                },
              ]);
              setPopupButtons([{type: 'close'}]);
            },
          };
        },
      },
    ],
  });

export const popupObjectSettingsNameEdit = (
  objectId: number,
  objectName: string,
  refetch: () => void,
) => {
  setPopup({
    open: true,
    mandatory: true,
    loading: false,

    header: 'Edit object name',
    content: [
      {
        type: 'info',
        bodyText: `Change the original object name`,
      },
      {
        type: 'input',
        labelText: 'Edit',
        elemKey: 'newObjectName',
        defaultValue: objectName,
      },
    ],
    buttons: [
      {type: 'cancel'},

      {
        type: 'confirmWithInput',
        labelText: 'Save',
        variant: 'outlined',
        onClick: async (elementValues) => {
          if (elementValues.newObjectName)
            await trpcFunc.trpcAppObjectSettingsUpdate.mutate({
              objectId: Number(objectId),
              oper: 'setObjectName',
              name: elementValues.newObjectName,
            });
          refetch();
          closePopup();
        },
      },
    ],
  });
};
