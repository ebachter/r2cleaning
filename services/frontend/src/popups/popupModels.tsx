import {t} from '../i18n/i18n';
import {trpcFunc} from '../trpc';
import {closePopup, setPopup} from '../zustand/popup';

export function popupProModelDel(modelid: number, refetch: () => void) {
  // console.log('modelid', modelid);
  setPopup({
    open: true,
    mandatory: false,
    header: t('popupModelDelHeader'),
    content: [
      {
        type: 'info',
        bodyText: t('popupModelDelContent', {modelid: String(modelid)}),
      },
    ],
    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        labelText: t('dialogTermButtonTextConfirm'),
        onClick: async () => {
          await trpcFunc.devModelDelSaga.mutate({modelId: modelid});
          refetch();
          closePopup();
        },
      },
    ],
  });
}

export function popupProModelCreate(refetch: () => void) {
  const elemKeys = [
    'buttonId',
    'switchId',
    'switchSelect',
    'buttonSelect',
    'stateId',
    'stateColor',
    'sensorId',
    'sensorUnit',
    'listId',
    'geo',
  ];
  // console.log('modelid', modelid);
  setPopup({
    open: true,
    mandatory: false,
    header: 'New model',
    content: [
      {
        type: 'info',
        bodyText: 'Create new model',
      },

      {
        type: 'input',
        elemKey: 'name',
        labelText: 'Name',
      },

      {
        type: 'sectionHeader',
        text: 'Add element',
      },

      {
        type: 'dialogSelect',
        label: 'Select action',
        elemKey: 'action',
        options: [
          {id: 'addButton', label: 'Add button'},
          {id: 'addButtonState', label: 'Add button state'},
          {id: 'addSwitch', label: 'Add switch'},
          {id: 'addSwitchState', label: 'Add switch state'},
          {id: 'addSensor', label: 'Add sensor'},
          {id: 'addList', label: 'Add list'},
          {id: 'addGeo', label: 'Add geo'},
        ],
        setOnChange: (
          val,
          {
            setPopupElementVisible,
            setPopupElementValue,
            setPopupElementOptions,
            popupValues,
          },
        ) => {
          setPopupElementValue('action', val);
          console.log(val);
          if (val === 'addButton') {
            elemKeys.forEach((key) => setPopupElementVisible(key, false));
            setPopupElementVisible('buttonId', true);
          }
          if (val === 'addButtonState') {
            elemKeys.forEach((key) => setPopupElementVisible(key, false));
            setPopupElementVisible('buttonSelect', true);
            setPopupElementVisible('stateId', true);
            setPopupElementVisible('stateColor', true);

            const json = JSON.parse(popupValues.json);
            console.log(json);
            setPopupElementOptions(
              'buttonSelect',
              Object.keys(json.buttons).map((v: string) => ({
                id: v,
                label: v,
              })),
            );
          }
          if (val === 'addSwitch') {
            elemKeys.forEach((key) => setPopupElementVisible(key, false));
            setPopupElementVisible('switchId', true);
          }
          if (val === 'addSwitchState') {
            elemKeys.forEach((key) => setPopupElementVisible(key, false));
            setPopupElementVisible('switchSelect', true);
            setPopupElementVisible('stateId', true);
            setPopupElementVisible('stateColor', true);

            const json = JSON.parse(popupValues.json);
            console.log(json);
            setPopupElementOptions(
              'switchSelect',
              Object.keys(json.switches).map((v: string) => ({
                id: v,
                label: v,
              })),
            );
          }
          if (val === 'addSensor') {
            elemKeys.forEach((key) => setPopupElementVisible(key, false));
            setPopupElementVisible('sensorId', true);
            setPopupElementVisible('sensorUnit', true);
          }
          if (val === 'addList') {
            elemKeys.forEach((key) => setPopupElementVisible(key, false));
            setPopupElementVisible('listId', true);
          }
          if (val === 'addGeo') {
            elemKeys.forEach((key) => setPopupElementVisible(key, false));
            setPopupElementVisible('geo', true);
          }
        },
      },

      {
        type: 'input',
        elemKey: 'buttonId',
        labelText: 'Button ID',
        visible: false,
      },

      {
        type: 'input',
        elemKey: 'switchId',
        labelText: 'Switch ID',
        visible: false,
      },

      {
        type: 'dialogSelect',
        elemKey: 'buttonSelect',
        label: 'Select button',
        visible: false,
        options: [],
      },

      {
        type: 'dialogSelect',
        elemKey: 'switchSelect',
        label: 'Select switch',
        visible: false,
        options: [],
      },

      {
        type: 'input',
        elemKey: 'stateId',
        labelText: 'State ID',
        visible: false,
      },

      {
        type: 'color',
        elemKey: 'stateColor',
        visible: false,
      },

      {
        type: 'input',
        elemKey: 'sensorId',
        labelText: 'Sensor ID',
        visible: false,
      },
      {
        type: 'input',
        elemKey: 'sensorUnit',
        labelText: 'Sensor unit',
        visible: false,
      },

      {
        type: 'input',
        elemKey: 'listId',
        labelText: 'List ID',
        visible: false,
      },
      {
        type: 'checkbox',
        elemKey: 'geo',
        label: 'Geo',
        visible: false,
        value: false,
      },

      {
        type: 'buttons',
        elemKey: 'buttons',
        visible: false,
        buttons: [
          {
            label: 'Cancel',
            onClick: (_, {setPopupElementVisible}) => {
              elemKeys.forEach((key) => setPopupElementVisible(key, false));
            },
          },
          {
            label: 'Add',
            onClick: (allValues, {setPopupElementValue}) => {
              console.log(allValues);
              console.log(typeof allValues.buttons);
              const json = JSON.parse(allValues.json);
              if (allValues.action === 'addButton') {
                if (allValues.buttonId) {
                  json.buttons[allValues.buttonId] = {
                    name: {en: allValues.buttonId, de: allValues.buttonId},
                    states: {},
                  };
                }
              }
              if (allValues.action === 'addButtonState') {
                if (
                  allValues.buttonSelect &&
                  allValues.stateId &&
                  allValues.stateColor
                ) {
                  json.buttons[allValues.buttonSelect].states[
                    allValues.stateId
                  ] = {
                    name: {
                      en: allValues.stateId,
                      de: allValues.stateId,
                    },
                    color: allValues.stateColor,
                  };
                }
              }
              if (allValues.action === 'addSwitch') {
                if (allValues.switchId) {
                  json.switches[allValues.switchId] = {
                    name: {en: allValues.switchId, de: allValues.switchId},
                    states: {},
                  };
                }
              }
              if (allValues.action === 'addSwitchState') {
                if (
                  allValues.switchSelect &&
                  allValues.stateId &&
                  allValues.stateColor
                ) {
                  json.switches[allValues.switchSelect].states[
                    allValues.stateId
                  ] = {
                    name: {
                      en: allValues.stateId,
                      de: allValues.stateId,
                    },
                    color: allValues.stateColor,
                  };
                }
              }

              if (allValues.action === 'addSensor') {
                json.sensors[allValues.sensorId] = {
                  name: {en: allValues.sensorId, de: allValues.sensorId},
                  unit: allValues.sensorUnit,
                };
              }

              if (allValues.action === 'addList') {
                json.lists[allValues.listId] = {
                  name: {en: allValues.listId, de: allValues.listId},
                };
              }

              if (allValues.action === 'addGeo') {
                json.geo = allValues.geo;
              }
              setPopupElementValue('json', JSON.stringify(json));
            },
          },
        ],
      },

      {
        type: 'json',
        elemKey: 'json',
        value: `{
          "buttons": {},
          "switches": {},
          "sensors": {},
          "sensors": {},
          "lists": {},
          "geo": false
        }`,
      },
    ],

    buttons: [
      {type: 'cancel'},
      {
        type: 'confirmWithInput',
        labelText: 'Create',
        onClick: async (allValues) => {
          await trpcFunc.asyncProModelCreate.mutate({
            name: allValues.name,
            descr: `Description of ${allValues.name}`,
            modelData: JSON.parse(allValues.json),
          });
          refetch();
          closePopup();
        },
      },
    ],
  });
}
