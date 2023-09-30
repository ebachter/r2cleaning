import {getAppState} from '../redux/store';
import {enqueueSnackbar} from 'notistack';
import {trpcFunc} from '../trpc';
import {
  closePopup,
  getPopupElementValue,
  setAppPopup,
  setPopup,
  setPopupElementError,
  setPopupElementOptions,
  setPopupElementValue,
} from '../zustand/popup';

export const popupObjectActionSensorAdd = (
  objectId: number,
  refetch: () => void,
) => {
  const st = getAppState();
  const lang = st.user.language;
  const objectSensors = st.objects[objectId].models.json_model_full.sensors;
  const sensorsOptions = Object.entries(objectSensors).map(([sensorId, o]) => ({
    id: sensorId,
    label: o.name[lang],
  }));
  /* const actionObjectsOptions = Object.entries(st.objects).reduce(
    (n, [objectId, o]) => ({...n, [objectId]: o.object_name}),
    {},
  ); */
  const actionObjectsOptions = Object.entries(st.objects).map(
    ([objectId, o]) => ({id: objectId, label: o.object_name}),
  );
  const getObjectSwitchesOptions = (objectId: number) => {
    return Object.entries(
      st.objects[objectId].models.json_model_full.switches || {},
    ).map(([switchId, o]) => ({id: switchId, label: o.name[lang]}));
  };

  const getObjectTasksOptions = (objectId: number, switchId: string) =>
    Object.entries(
      st.objects[objectId].models.json_model_full.switches[switchId].states,
    ).map(([stateId, o]) => ({id: stateId, label: o.task.name[lang]}));

  // const formValues = ['actionObjectId', 'actionSwitchId', 'actionTaskId'];
  /* const checkIfFilled = () => {
    const arr = formValues.map(getPopupElementValue);
    return !arr.includes(null) && !arr.includes('') ? true : false;
  }; */

  const resetSwitches = () => {
    setPopupElementValue('actionSwitchId', null);
    setPopupElementOptions('actionSwitchId', []);
  };

  const resetTasks = () => {
    setPopupElementValue('actionTaskId', null);
    setPopupElementOptions('actionTaskId', []);
  };

  setAppPopup([
    'sensor',
    'options',
    'actionObjectId',
    'actionSwitchId',
    'actionTaskId',
  ])({
    open: true,
    mandatory: true,
    header: 'Add sensor action',
    loading: false,
    content: [
      {
        type: 'info',
        bodyText: `Add sensor action for Object ${objectId}`,
      },
      {
        type: 'dialogSelect',
        elemKey: 'sensor',
        label: 'Select sensor',
        visible: true,
        options: sensorsOptions,
        value: '',
        setOnChange: (val) => {
          console.log(val);
          setPopupElementValue('sensor', val);
        },
      },
      {
        type: 'options',
        elemKey: 'options',
        value: null, // {sign: '', value: null},
        setOnChange: ({sign, value}) => {
          if (sign) setPopupElementValue('options', {sign});
          else {
            !isNaN(Number(value)) && setPopupElementValue('options', {value});
          }
        },
      },

      {
        type: 'autocomplete',
        elemKey: 'actionObjectId',
        label: 'Action object',
        value: null,
        initialValue: '',
        options: actionObjectsOptions,
        setOnChange: (val) => {
          resetTasks();
          if (!val) {
            resetSwitches();
            setPopupElementValue('actionObjectId', null);
          } else {
            setPopupElementValue('actionObjectId', val);
            setPopupElementValue('actionSwitchId', null);

            const objectSwitchOptions = getObjectSwitchesOptions(Number(val));
            setPopupElementOptions('actionSwitchId', objectSwitchOptions);
          }
        },
      },
      {
        type: 'autocomplete',
        elemKey: 'actionSwitchId',
        // bodyText:  `${objectId}`,
        label: 'Action switch',
        value: null,
        initialValue: '',
        options: [],
        setOnChange: (val) => {
          if (!val) {
            setPopupElementValue('actionTaskId', null);
            setPopupElementOptions('actionTaskId', []);
            setPopupElementValue('actionSwitchId', null);
            return;
          } else {
            setPopupElementValue('actionSwitchId', val);
            const objectId = getPopupElementValue('actionObjectId');
            const tasksOptions = getObjectTasksOptions(Number(objectId), val);
            setPopupElementOptions('actionTaskId', tasksOptions);
          }
        },
      },
      {
        type: 'autocomplete',
        elemKey: 'actionTaskId',
        // bodyText:  `${objectId}`,
        label: 'Action task',
        value: null,
        initialValue: '',
        options: [],
        setOnChange: (val) => {
          setPopupElementValue('actionTaskId', val || null);
        },
      },
    ],

    buttons: [
      {type: 'close', elemKey: 'closeButton'},
      {
        type: 'confirmWithInput',
        elemKey: 'addButton',
        variant: 'outlined',
        labelText: 'Add',
        onClick: async (allValues) => {
          const actionObjectId = getPopupElementValue('actionObjectId');
          if (!objectId) setPopupElementError('actionObjectId', 'Is required');
          const actionSwitchId = getPopupElementValue('actionSwitchId');
          if (!actionSwitchId)
            setPopupElementError('actionSwitchId', 'Is required');
          const actionTaskId = getPopupElementValue('actionTaskId');
          if (!actionTaskId)
            setPopupElementError('actionTaskId', 'Is required');

          await trpcFunc.appObjectActionSensorAdd.mutate({
            objectId: Number(objectId),
            sensorId: allValues.sensor,
            sign: allValues.options.sign,
            value: Number(allValues.options.value),
            actionObjectId: Number(actionObjectId),
            actionSwitchId: allValues.actionSwitchId,
            actionTaskId: allValues.actionTaskId,
          });
          // await trpcClient.appObjectsActionsLoad.query();
          refetch();
          closePopup();
        },
      },
    ],
  });
};

export const popupObjectActionSensorDel = ({
  objectId,
  sensorActionId,
  refetch,
}: {
  objectId: number;
  sensorActionId: number;
  refetch: () => void;
}) =>
  setAppPopup([])({
    open: true,
    mandatory: true,
    header: 'Delete sensor action',
    loading: false,
    // globalVars: {tab: 'button'},
    content: [
      {
        type: 'info',
        bodyText: `Do you want to delete the switch action [${sensorActionId}]`,
      },
    ],
    buttons: [
      {type: 'close', elemKey: 'closeButton'},
      {
        type: 'confirmWithInput',
        elemKey: 'addButton',
        variant: 'outlined',
        labelText: 'Delete',
        onClick: async () => {
          await trpcFunc.appObjectActionSensorDel.mutate({
            objectId,
            sensorActionId,
          });

          refetch();
          closePopup();
        },
      },
    ],
  });

export const popupObjectActionsSwitchDel = (
  object_action_switch_id: number,
  refetch: () => void,
) =>
  setPopup({
    header: 'Delete switch action',
    content: [
      {
        type: 'info',
        bodyText: `Do you really want to delete the action [${object_action_switch_id}]?`,
      },
    ],
    buttons: [
      {type: 'close'},
      {
        type: 'confirmWithInput',
        onClick: async () => {
          await trpcFunc.trpcObjectActionsSwitchDel.mutate({
            objectActionSwitchId: object_action_switch_id,
          });
          enqueueSnackbar('Switch action deleted', {
            variant: 'success',
          });
          refetch();
          closePopup();
        },
      },
    ],
  });

export const popupObjectActionsSwitchAdd = (
  objectId: number,
  refetch: () => void,
) => {
  const objects = getAppState().objects;
  const switches = objects[objectId]?.models?.json_model_full.switches || {};
  const lang = getAppState().user.language;

  setAppPopup([
    'switchId',
    'stateId',
    'reactionSwitchId',
    'reactionTaskId',
    'reactionObjectId',
  ])({
    open: true,
    mandatory: true,
    header: `Add switch alert`,
    content: [
      {
        type: 'info',
        bodyText: `Action in case of the specified switch status`,
      },

      {
        type: 'dialogSelect',
        elemKey: 'switchId',
        value: '',
        label: 'Action switch',
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
        label: 'Action state',
        setOnChange: (val, {setPopupElementValue}) => {
          console.log('+++', val);
          setPopupElementValue('stateId', val);
        },
        options: Object.entries({}).map(([id, sensorData]) => ({
          id,
          label: 'sensorData.name[lang]',
        })),
      },

      // //////////////////////////////////////////////////////////////////
      {
        type: 'autocomplete',
        elemKey: 'reactionObjectId',
        value: '',
        label: 'Reaction object',
        options: Object.entries(objects || {}).map(([id, switchData]) => ({
          id,
          label: switchData.object_name,
        })),
        setOnChange: (selectedObjectId, {setPopupElementValue}) => {
          setPopupElementValue('reactionObjectId', selectedObjectId);

          const states = Object.entries(
            selectedObjectId
              ? objects[Number(selectedObjectId)].models.json_model_full
                  .switches
              : {},
          ).map(([id, stateData]) => ({
            id,
            label: stateData.name[lang],
          }));
          setPopupElementOptions('reactionSwitchId', states);
          // setPopupElementValue('reactionSwitchId', '');
        },
      },

      {
        type: 'dialogSelect',
        elemKey: 'reactionSwitchId',
        value: '',
        label: 'Switch',
        options: [],
        setOnChange: (
          selectedSwitchId,
          {setPopupElementValue, popupValues},
        ) => {
          setPopupElementValue('reactionSwitchId', selectedSwitchId);

          const states = Object.entries(
            objects[Number(popupValues['reactionObjectId'])].models
              .json_model_full.switches[selectedSwitchId].states,
          ).reduce((n, [id, stateData]) => {
            if (stateData.task.name) {
              n.push({
                id,
                label: stateData.task.name[lang],
              });
            }
            return n;
          }, [] as {id: string; label: string}[]);
          setPopupElementOptions('reactionTaskId', states);
        },
      },

      {
        type: 'dialogSelect',
        elemKey: 'reactionTaskId',
        // visible: false,
        value: '',
        label: 'Task',
        setOnChange: (val, {setPopupElementValue, popupValues}) => {
          console.log('+++', val, popupValues);
          setPopupElementValue('reactionTaskId', val);
        },
        options: [],
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
            await trpcFunc.appObjectActionSwitchAdd.mutate({
              objectId,
              switchId: elementValues.switchId,
              stateId: elementValues.stateId,
              reactionObjectId: Number(elementValues.reactionObjectId),
              reactionSwitchId: elementValues.reactionSwitchId,
              reactionTaskId: elementValues.reactionTaskId,
            });
            refetch();
          }

          closePopup();
        },
      },
    ],
  });
};
