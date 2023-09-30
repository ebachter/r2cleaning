import {useState} from 'react';
import {trpcComp} from '../../trpc';
import useTypedParams from '../../hooks/useTypedParams';
import {sharedTabsObject} from './_sharedTabsObject';
import GenericPage from '../../GenericPage';
import {useAppSelector} from '../../hooks/hooksRedux';
import {GenericPageContainerType} from '../../types/typesGenericPage';
import {
  popupObjectActionSensorAdd,
  popupObjectActionSensorDel,
  popupObjectActionsSwitchAdd,
  popupObjectActionsSwitchDel,
} from '../../popups/popupObjectActions';
import {popupProObjectTimerDel} from '../../popups/popupObjectTimers';

function ObjectsActionsPage() {
  const {objectId} = useTypedParams(['objectId']);

  const {data, refetch} = trpcComp.appObjectsTimersLoad.useQuery(
    Number(objectId),
    {initialData: {timers: []}},
  );
  const objectsObj = useAppSelector((state) => state.objects);
  const lang = useAppSelector((state) => state.user.language);

  const sensorActions: GenericPageContainerType[] = [
    {
      type: 'container',
      list: data.timers.map((a) => ({
        primaryText: `${objectsObj[a.object_fk]?.object_name} > ${
          objectsObj[a.object_fk]?.models?.json_model_full.switches[a.switch_id]
            .name[lang]
        } > ${
          objectsObj[a.object_fk]?.models?.json_model_full.switches[a.switch_id]
            .states[a.task_id]?.task.name[lang]
        }`,
        secondaryText: a.orig_date_from.toUTCString(),
        action: {
          menu: [
            {
              text: 'Delete',
              func: () => {
                popupProObjectTimerDel(objectId, a.timer_id, refetch);
              },
            },
          ],
        },
      })),
    },
  ];

  const tabs = sharedTabsObject(objectId);

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
            primary: 'Timers',
            /* menu: [
              {
                text: 'Add timer',
                func: () => {
                  popupObjectActionSensorAdd(objectId, refetch);
                },
              },
            ], */
          },
          ...sensorActions,
        ],
      }}
    />
  );
}

export default ObjectsActionsPage;
