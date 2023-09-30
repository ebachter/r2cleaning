import useTypedParams from '../../hooks/useTypedParams';
import {trpcComp} from '../../trpc';
import GenericPage from '../../GenericPage';
import {sharedTabsObject} from './_sharedTabsObject';
import {
  popupObjectAlertButtonDel,
  popupObjectAlertConnection,
  popupObjectAlertSensorDel,
  popupObjectAlertSwitchDel,
  popupObjectButtonAlertAdd,
  popupObjectSensorAlertAdd,
  popupObjectSwitchAlertAdd,
} from '../../popups/popupObjectAlerts';
import {GenericPageContainerType} from '../../types/typesGenericPage';
import {useAppSelector} from '../../hooks/hooksRedux';

function ObjectsAlertsPage() {
  const {objectId} = useTypedParams(['objectId']);
  const {data, refetch} = trpcComp.appLoadObjectAlerts.useQuery(
    Number(objectId),
  );

  const objectsObj = useAppSelector((state) => state.objects);
  const lang = useAppSelector((state) => state.user.language);

  const {alerts} = data || {};

  const tabs = sharedTabsObject(objectId);

  const sensors: GenericPageContainerType[] = Object.entries(
    alerts?.sensors || {},
  )?.map(([sensorId, {greater, less}], i) => ({
    type: 'container',
    title:
      objectsObj[objectId]?.models?.json_model_full.sensors[sensorId]?.name[
        lang
      ],
    list: [
      ...(greater
        ? [
            {
              primaryText: `Value > ${greater?.value}`,
              secondaryText: Object.keys(greater?.channels || {}).join(', '),
              action: {
                menu: [
                  {
                    text: 'Delete',
                    func: () => {
                      popupObjectAlertSensorDel(
                        objectId,
                        sensorId,
                        true,
                        refetch,
                      );
                    },
                  },
                ],
              },
            },
          ]
        : []),
      ...(less
        ? [
            {
              primaryText: `Value < ${less?.value}`,
              secondaryText: Object.keys(less?.channels || {}).join(', '),
              action: {
                menu: [
                  {
                    text: 'Delete',
                    func: () => {
                      popupObjectAlertSensorDel(
                        objectId,
                        sensorId,
                        false,
                        refetch,
                      );
                    },
                  },
                ],
              },
            },
          ]
        : []),
    ],
  }));

  const switches: GenericPageContainerType[] = [
    {
      type: 'container',
      // title: `${objectsObj[objectId]?.models?.json_model_full.switches[switchId]?.name[lang]} = ${objectsObj[objectId]?.models?.json_model_full.switches?.[switchId]?.states[stateId]?.name[lang]}`,
      list: Object.entries(alerts?.switches || {}).map(
        ([switch_state, o], i) => {
          const [switchId, stateId] = switch_state.split(':');
          return {
            primaryText: `${objectsObj[objectId]?.models?.json_model_full.switches[switchId]?.name[lang]} = ${objectsObj[objectId]?.models?.json_model_full.switches?.[switchId]?.states[stateId]?.name[lang]}`,
            secondaryText: `Channels: ${[...o].join(', ')}`,
            //secondaryText: Object.keys(greater?.channels || {}).join(', '),
            action: {
              menu: [
                {
                  text: 'Delete',
                  func: () => {
                    popupObjectAlertSwitchDel(
                      objectId,
                      switchId,
                      stateId,
                      refetch,
                    );
                  },
                },
              ],
            },
          };
        },
      ),
    },
  ];

  const buttons: GenericPageContainerType[] = [
    {
      type: 'container',
      // title: `${objectsObj[objectId]?.models?.json_model_full.switches[switchId]?.name[lang]} = ${objectsObj[objectId]?.models?.json_model_full.switches?.[switchId]?.states[stateId]?.name[lang]}`,
      list: Object.entries(alerts?.buttons || {}).map(
        ([switch_state, o], i) => {
          const [buttonId, stateId] = switch_state.split(':');
          return {
            primaryText: `${objectsObj[objectId]?.models?.json_model_full.buttons[buttonId]?.name[lang]} = ${objectsObj[objectId]?.models?.json_model_full.buttons?.[buttonId]?.states[stateId]?.name[lang]}`,
            secondaryText: `Channels: ${[...o].join(', ')}`,
            //secondaryText: Object.keys(greater?.channels || {}).join(', '),
            action: {
              menu: [
                {
                  text: 'Delete',
                  func: () => {
                    popupObjectAlertButtonDel(
                      objectId,
                      buttonId,
                      stateId,
                      refetch,
                    );
                  },
                },
              ],
            },
          };
        },
      ),
    },
  ];

  return (
    <GenericPage
      pageData={{
        settingsMenu: [
          {
            label: 'Disconnect',
            onClick: () => {
              // trpcFunc.reConnectObject.mutate({mqttClientId: o.mqtt_client_id});
            },
          },
        ],
        content: [
          tabs,
          {
            type: 'subtitle',
            primary: 'Connection alerts',
          },
          {
            type: 'container',
            title: 'Object online',
            list: [
              {
                primaryText: 'Email notification',
                action: {
                  toggle: {
                    value: alerts?.onoff.onConnect.email || false,
                    onToggle: (v) => {
                      popupObjectAlertConnection(
                        objectId,
                        'email',
                        'onConnect',
                        v,
                        refetch,
                      );
                    },
                  },
                },
              },
              {
                primaryText: 'Push notification',
                action: {
                  toggle: {
                    value: alerts?.onoff.onConnect.push || false,
                    onToggle: (v) => {
                      popupObjectAlertConnection(
                        objectId,
                        'push',
                        'onConnect',
                        v,
                        refetch,
                      );
                    },
                  },
                },
              },
            ],
          },
          {
            type: 'container',
            title: 'Object offline',
            list: [
              {
                primaryText: 'Email notification',
                action: {
                  toggle: {
                    value: alerts?.onoff.onDisconnect.email || false,
                    onToggle: (v) => {
                      popupObjectAlertConnection(
                        objectId,
                        'email',
                        'onDisconnect',
                        v,
                        refetch,
                      );
                    },
                  },
                },
              },
              {
                primaryText: 'Push notification',
                action: {
                  toggle: {
                    value: alerts?.onoff.onDisconnect.push || false,
                    onToggle: (v) => {
                      popupObjectAlertConnection(
                        objectId,
                        'push',
                        'onDisconnect',
                        v,
                        refetch,
                      );
                    },
                  },
                },
              },
            ],
          },
          {
            type: 'subtitle',
            primary: 'Sensor alerts',
            menu: [
              {
                text: 'Add new',
                func: () => {
                  popupObjectSensorAlertAdd(objectId, refetch);
                },
              },
            ],
          },
          ...sensors,
          {
            type: 'subtitle',
            primary: 'Button alerts',
            menu: [
              {
                text: 'Add new',
                func: () => {
                  popupObjectButtonAlertAdd(objectId, refetch);
                },
              },
            ],
          },
          ...buttons,
          {
            type: 'subtitle',
            primary: 'Switch alerts',
            menu: [
              {
                text: 'Add new',
                func: () => {
                  popupObjectSwitchAlertAdd(objectId, refetch);
                },
              },
            ],
          },
          ...switches,
        ],
      }}
    />
  );
}

export default ObjectsAlertsPage;
