import {
  appendPopupContent,
  delPopupContentElemByKey,
  getPopupAllValues,
  getPopupContentElemKeys,
  setPopup,
  setPopupButtons,
  setPopupContent,
  setPopupElementValue,
  setPopupInputEndIcon,
} from '../zustand/popup';
import {Popup, PopupContentCheckbox} from '../types/typesPopup';
import _ from 'lodash';
import {trpcFunc} from '../trpc';
import {createBrowserHistory} from 'history';
import {callAppObjectsLoad} from '../utils/trpcCalls';
import {pushRoute} from '../router/helpers';
import {t} from '../i18n/i18n';

const createPopupCheckbox = (elemKey: string, name: string) => {
  const checkBox: PopupContentCheckbox = {
    type: 'checkbox',
    elemKey,
    label: name,
    value: false,
    onChange: (val) => {
      setPopupElementValue(elemKey, val);
    },
  };
  return checkBox;
};

const deletePopupCheckboxes = () => {
  const checkBoxKeys = getPopupContentElemKeys().filter((k) =>
    k.startsWith('service:'),
  );
  checkBoxKeys.forEach((key) => {
    delPopupContentElemByKey(key);
  });
};

const debounceModel = _.debounce(async (elementId, modelId) => {
  const res = await trpcFunc.appObjectRegistrationCheck.query({
    modelId: Number(modelId),
  });
  setPopupInputEndIcon(elementId, res?.exists ? 'Done' : 'Error');
  if (res?.exists) {
    const checkBoxes = res?.services.map((o) => {
      const elemKey = `service:${o.service_template_id}`;
      return createPopupCheckbox(elemKey, o.service_template_name);
    });
    appendPopupContent(checkBoxes);
  } else {
    deletePopupCheckboxes();
  }
}, 1000);

const debounceMqttClient = _.debounce(async (elementId, clientId) => {
  const res = await trpcFunc.appObjectRegistrationCheck.query({
    mqttClientId: clientId,
  });
  setPopupInputEndIcon(elementId, res?.available ? 'Done' : 'Error');
}, 1000);

/* const checkBoxes: PopupContentCheckbox[] = [
  {
    type: 'checkbox',
    elemKey: 'checkbox1',
    label:  'Insurance 1',
    value: false,
    onChange: (val) => {
      setPopupElementValue('checkbox1', val);
    },
  },
]; */

export const popupRegisterObjectManual = () =>
  setPopup({
    open: true,
    mandatory: true,
    header: 'Register object',
    loading: false,
    content: [
      {
        type: 'info',
        elemKey: 'info1',
        bodyText: `Please enter your IoT object data for registration`,
      },
      {
        type: 'input',
        labelText: 'Model ID',
        elemKey: 'modelid',
        value: '',
        setOnChange: (val) => {
          const value = val.replace(/[^0-9]/g, '');
          debounceModel.cancel();
          setPopupInputEndIcon('modelid', null);
          setPopupElementValue('modelid', value);
          if (value) debounceModel('modelid', val);
        },
        // endIcon: 'Done',
      },
      {
        type: 'input',
        labelText: 'Client ID',
        elemKey: 'clientid',
        value: '',
        setOnChange: (val) => {
          debounceMqttClient.cancel();
          setPopupInputEndIcon('clientid', null);
          setPopupElementValue('clientid', val);
          if (val) debounceMqttClient('clientid', val);
        },
      },
      {
        type: 'input',
        labelText: 'Username',
        elemKey: 'username',
        value: '',
        setOnChange: (val) => {
          setPopupElementValue('username', val);
        },
      },
      {
        type: 'input',
        password: true,
        labelText: 'Password',
        elemKey: 'password',
        value: '',
        setOnChange: (val) => {
          setPopupElementValue('password', val);
        },
      },
      // ...checkBoxes,
    ],
    buttons: [
      {type: 'close'},
      {
        type: 'confirmWithInput',
        variant: 'outlined',
        labelText: 'Add',
        onClick: async () => {
          /* const modelId = getPopupElementValue('modelid');
          const mqttClientId = getPopupElementValue('clientid');
          const userName = getPopupElementValue('username');
          const passWord = getPopupElementValue('password'); */

          const allValues = getPopupAllValues();

          const {
            modelid: modelId,
            clientid: mqttClientId,
            username: userName,
            password: passWord,
            ...services
          } = allValues;

          if (
            modelId &&
            mqttClientId &&
            userName &&
            passWord &&
            !Object.values(services).includes(false)
          ) {
            const res = await trpcFunc.appObjectRegister.mutate({
              mode: 'manual',
              modelId: Number(modelId),
              mqttClientId,
              userName,
              passWord,
              services,
            });
            if (res.objectid) {
              setPopupContent([
                {
                  type: 'success',
                  bodyText: t('popupObjectRegisterSuccess', {
                    objectId: res.objectid,
                    name: res.name,
                  }),
                },
              ]);
              setPopupButtons([
                {type: 'close'},
                {
                  type: 'confirmWithInput',
                  labelText: 'Open',
                  onClick: () => {
                    pushRoute(`/objects/${res.objectid}`);
                  },
                },
              ]);
              callAppObjectsLoad();
            }
          }
        },
      },
    ],
  });

export const popupRegisterObjectQr = async (): Promise<Popup> => {
  let {location, replace} = createBrowserHistory();
  const newUrl = new URLSearchParams(location.search);
  const qrModelid = newUrl.get('model') || '';
  const qrClientid = newUrl.get('clientid') || '';
  const qrUsername = newUrl.get('username') || '';
  const qrPassword = newUrl.get('password') || '';

  const checkModel = await trpcFunc.appObjectRegistrationCheck.query({
    modelId: Number(qrModelid),
  });
  // setPopupInputEndIcon(elementId, res?.exists ? 'Done' : 'Error');
  // let checkBoxes =[];
  // if (res?.exists) {
  let checkBoxes = (checkModel?.services || []).map((o) => {
    const elemKey = `service:${o.service_template_id}`;
    return createPopupCheckbox(elemKey, o.service_template_name);
  });

  return {
    open: true,
    mandatory: true,
    header: 'Register object',
    loading: false,
    content: [
      {
        type: 'info',
        elemKey: 'info1',
        bodyText: `QR object registration`,
      },
      {
        type: 'input',
        labelText: 'Model ID',
        elemKey: 'modelid',
        value: qrModelid,
        disabled: true,
      },
      {
        type: 'input',
        labelText: 'Client ID',
        elemKey: 'clientid',
        value: qrClientid,
        disabled: true,
      },
      {
        type: 'input',
        labelText: 'Username',
        elemKey: 'username',
        value: qrUsername,
        disabled: true,
      },
      {
        type: 'input',
        password: true,
        labelText: 'Password',
        elemKey: 'password',
        value: qrPassword,
        disabled: true,
      },
      ...checkBoxes,
    ],
    buttons: [
      {
        type: 'close',
        onButtonClick: () => {
          replace('/objects');
        },
      },
      {
        type: 'confirmWithInput',
        variant: 'outlined',
        labelText: 'Add',
        onClick: async () => {
          if (!checkModel?.exists) {
            console.error('Invalid model ID');
            return;
          }

          if (!qrModelid || !qrClientid || !qrUsername || !qrPassword) {
            console.error('Invalid parameters');
            return;
          }

          const allValues = getPopupAllValues();

          const services = Object.entries(allValues).reduce(
            (n, [serviceId, value]) =>
              serviceId.startsWith('service:') ? {...n, [serviceId]: value} : n,
            {},
          );

          if (Object.values(services).includes(false)) {
            console.error('Services must be accepted');
            return;
          }
          const res = await trpcFunc.appObjectRegister.mutate({
            mode: 'qr',
            modelId: Number(qrModelid),
            mqttClientId: qrClientid,
            userName: qrUsername,
            passWord: qrPassword,
            services: services,
          });
          if (res.objectid) {
            setPopupContent([
              {
                type: 'success',
                bodyText: t('popupObjectRegisterSuccess', {
                  objectId: res.objectid,
                  name: res.name,
                }),
              },
            ]);
            setPopupButtons([
              {type: 'close'},
              {
                type: 'confirmWithInput',
                labelText: 'Open',
                onClick: () => {
                  pushRoute(`/objects/${res.objectid}`);
                },
              },
            ]);
            callAppObjectsLoad();
          }
        },
      },
    ],
  };
};

export const popupObjectRegisterSearch = async ({
  mqttClientId,
  slaveModelId,
  slaveModelName,
}: {
  mqttClientId: string;
  slaveModelId: number;
  slaveModelName: string;
}): Promise<Popup> => {
  const res = await trpcFunc.appObjectRegistrationCheck.query({
    modelId: Number(slaveModelId),
  });
  // setPopupInputEndIcon(elementId, res?.exists ? 'Done' : 'Error');
  // let checkBoxes =[];
  // if (res?.exists) {
  let checkBoxes = (res?.services || []).map((o) => {
    const elemKey = `service:${o.service_template_id}`;
    return createPopupCheckbox(elemKey, o.service_template_name);
  });
  // appendPopupContent(checkBoxes);
  // }

  return {
    open: true,
    mandatory: true,
    header: 'Register object',
    loading: false,
    content: [
      {
        type: 'info',
        elemKey: 'info1',
        bodyText: `Reservation of ${slaveModelName}`,
      },
      {
        type: 'input',
        labelText: 'Model ID',
        elemKey: 'modelid',
        value: String(slaveModelId),
        disabled: true,
      },
      {
        type: 'input',
        labelText: 'Client ID',
        elemKey: 'clientid',
        value: mqttClientId,
        disabled: true,
      },
      ...checkBoxes,
    ],
    buttons: [
      {
        type: 'close',
      },
      {
        type: 'confirmWithInput',
        variant: 'outlined',
        labelText: 'Add',
        onClick: async () => {
          if (!res?.exists) {
            console.error('Invalid model ID');
            return;
          }
          const allValues = getPopupAllValues();

          const {clientid, modelid, ...services} = allValues;

          if (Object.values(services).includes(false)) {
            console.error('Services must be accepted');
            return;
          }

          if (slaveModelId && mqttClientId) {
            const res = await trpcFunc.appObjectRegister.mutate({
              mode: 'search',
              modelId: slaveModelId,
              mqttClientId: mqttClientId,
              services,
            });
            if (res.objectid) {
              setPopupContent([
                {
                  type: 'success',
                  bodyText: t('popupObjectRegisterSuccess', {
                    objectId: res.objectid,
                    name: res.name,
                  }),
                },
              ]);
              setPopupButtons([
                {type: 'close'},
                {
                  type: 'confirmWithInput',
                  labelText: 'Open',
                  onClick: () => {
                    pushRoute(`/objects/${res.objectid}`);
                  },
                },
              ]);
              callAppObjectsLoad();
            }
          }
        },
      },
    ],
  };
};
