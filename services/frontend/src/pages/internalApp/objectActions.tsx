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

function ObjectsActionsPage() {
  const {objectId} = useTypedParams(['objectId']);

  const {data: tactions, refetch} = trpcComp.appObjectsActionsLoad.useQuery(
    Number(objectId),
  );
  const objectsObj = useAppSelector((state) => state.objects);
  const lang = useAppSelector((state) => state.user.language);

  const switchActions: GenericPageContainerType[] = [
    {
      type: 'container',
      // title: `${objectsObj[objectId]?.models?.json_model_full.switches[switchId]?.name[lang]} = ${objectsObj[objectId]?.models?.json_model_full.switches?.[switchId]?.states[stateId]?.name[lang]}`,
      list: (tactions?.switchActions || []).map((o) => {
        const actorModel = objectsObj[o.actor_object_fk].models;
        const reactorModel = objectsObj[o.reactor_object_fk].models;

        const actorObjectName = objectsObj[o.actor_object_fk]?.object_name;
        const reActorObjectName = objectsObj[o.reactor_object_fk]?.object_name;

        const actorControlName =
          actorModel?.json_model_full.switches[o.actor_switch_id]?.name[lang];
        const reActorControlName =
          reactorModel?.json_model_full.switches[o.reactor_switch_id]?.name[
            lang
          ];

        const actorStateName =
          actorModel?.json_model_full.switches[o.actor_switch_id]?.states[
            o.actor_state_id
          ].name[lang];
        const reActorStateName =
          reactorModel?.json_model_full.switches[o.reactor_switch_id]?.states[
            o.reactor_task_id
          ].task.name[lang];

        return {
          primaryText: `If [${o.actor_object_fk}] ${actorObjectName} > ${actorControlName} > ${actorStateName}`,
          secondaryText: `Do [${o.reactor_object_fk}] ${reActorObjectName} > ${reActorControlName} > ${reActorStateName}`,
          action: {
            menu: [
              {
                text: 'Delete',
                func: () => {
                  popupObjectActionsSwitchDel(
                    o.object_action_switch_id,
                    refetch,
                  );
                },
              },
            ],
          },
        };
      }),
    },
  ];

  const sensorActions: GenericPageContainerType[] = [
    {
      type: 'container',
      // title: `${objectsObj[objectId]?.models?.json_model_full.switches[switchId]?.name[lang]} = ${objectsObj[objectId]?.models?.json_model_full.switches?.[switchId]?.states[stateId]?.name[lang]}`,
      list: (tactions?.sensorActions || []).map((a, i) => ({
        primaryText: `if ${
          objectsObj[a.object_fk]?.models?.json_model_full.sensors[a.sensor_id]
            ?.name[lang]
        } of ${objectsObj[a.object_fk]?.object_name} ${a.sign} ${a.value}`,
        secondaryText: a.action_object_fk
          ? `Set ${
              objectsObj[a.action_object_fk]?.models?.json_model_full.switches[
                a.action_actor_id
              ].name[lang]
            } of ${objectsObj[a.action_object_fk]?.object_name} to ${
              objectsObj[a.action_object_fk]?.models?.json_model_full.switches[
                a.action_actor_id
              ].states[a.action_task_id].task.name[lang]
            }`
          : '',
        action: {
          menu: [
            {
              text: 'Delete',
              func: () => {
                popupObjectActionSensorDel({
                  objectId,
                  sensorActionId: a.object_action_sensor_id,
                  refetch,
                });
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
            primary: 'Sensor actions',
            menu: [
              {
                text: 'Add sensor action',
                func: () => {
                  popupObjectActionSensorAdd(objectId, refetch);
                },
              },
            ],
          },
          ...sensorActions,

          {
            type: 'subtitle',
            primary: 'Switch actions',
            menu: [
              {
                text: 'Add switch action',
                func: () => {
                  popupObjectActionsSwitchAdd(objectId, refetch);
                },
              },
            ],
          },
          ...switchActions,
        ],
      }}
    />
  );
}

export default ObjectsActionsPage;
