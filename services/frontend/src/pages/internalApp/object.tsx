// import {HeaderObjectOnOff} from '../../../components/HeaderObjectOnOff';
import GenericPage from '../../GenericPage';
import {GenericPageType} from '../../types/typesGenericPage';
import {useAppSelector} from '../../hooks/hooksRedux';
import {trpcFunc} from '../../trpc';
import useTypedParams from '../../hooks/useTypedParams';
import {callAppObjectsLoad} from '../../utils/trpcCalls';
import {useEffect} from 'react';
import {sharedTabsObject} from './_sharedTabsObject';
// import {dataInitialObjectLive} from '../../../utils/defaults';

const ObjectPage = () => {
  const {objectId} = useTypedParams(['objectId']);

  const objectsObj = useAppSelector((state) => state.objects);
  const liveData = useAppSelector((state) => state.live[objectId]);
  const o = objectsObj[objectId] || {};

  // const {data} = trpcComp.simulatorObjectLoad.useQuery({objectId});
  /* const liveData = useUtilsStore((state) => state.data.liveData[objectId]); // || dataInitialObjectLive;
  const liveData2 = useUtilsStore((state) => state.data.liveData); // || dataInitialObjectLive;
  console.log('liveData2', liveData2); */

  useEffect(() => {
    callAppObjectsLoad();
  }, []);
  // const objectsObj = useAppSelector((state) => state.objects);

  const lang = useAppSelector((state) => state.user.language);

  // const modelData = data?.object.models.json_model_full;
  const modelData =
    useAppSelector((state) => state.objects[objectId]?.models) || {};

  // useAppSelector((state) => state.objects[objectId]?.models) || {};

  // const live = useAppSelector((state) => state.objects[objectId]?.live) || {};
  const online = liveData;

  // console.log('live', live);

  /* const mqtt_client_id = useAppSelector(
    (state) => o?.mqtt_client_id,
  ); */

  const tabs = sharedTabsObject(objectId);

  const pageData: GenericPageType = {
    settingsMenu: [
      {
        label: 'Disconnect',
        onClick: () => {
          trpcFunc.reConnectObject.mutate({mqttClientId: o.mqtt_client_id});
        },
      },
    ],
    content: [
      tabs,
      {
        type: 'list',
        data: [
          {
            id: Number(objectId),
            primaryText: o?.object_name || '',
            customIcon: o?.models.icon || undefined,
            connection: online ? 'Connected' : 'Not connected',
            project: o?.projects || null,
            secondaryCircleColor: online ? 'green' : 'silver',
          },
        ],
      },
      {
        type: 'subtitle',
        primary: 'Components',
      },
      {
        type: 'container',
        title: 'Buttons',
        list: modelData.json_model_full.buttons
          ? Object.entries(modelData.json_model_full.buttons).map(
              ([buttonid, {states, name}]) => ({
                primaryText: name[lang],
                action: {
                  button: {
                    disabled: !online,
                    label: liveData?.buttons?.[buttonid]
                      ? states[liveData?.buttons[buttonid]]?.name[lang]
                      : 'OFF',
                    verticalLineColor: liveData?.buttons?.[buttonid]
                      ? states[liveData?.buttons?.[buttonid]]?.color
                      : 'transparent',
                    onClick: () => {
                      if (o?.mqtt_client_id)
                        trpcFunc.sendObjectButtonTask.mutate({
                          mqttClientId: o?.mqtt_client_id,
                          objectId: Number(objectId),
                          buttonId: buttonid,
                        });
                    },
                  },
                },
              }),
            )
          : [],
      },
      {
        type: 'container',
        title: 'Switches',
        list: modelData.json_model_full.switches
          ? Object.entries(modelData.json_model_full.switches).map(
              ([switchId, {states, name}]) => {
                return {
                  primaryText: name[lang],
                  action: {
                    switch: {
                      disabled: !online,
                      color: liveData?.switches?.[switchId]
                        ? states[liveData?.switches?.[switchId]]?.color
                        : 'transparent',
                      label: liveData?.switches?.[switchId]
                        ? states[liveData?.switches?.[switchId]]?.name[lang]
                        : 'OFF',

                      options: Object.entries(states)
                        .filter(([, stateData]) => stateData.task)
                        .map(([stateId, stateData]) => ({
                          id: stateId,
                          color: stateData.color,
                          label: stateData.task.name[lang],
                          onClick: () => {
                            trpcFunc.sendObjectSwitchTask.mutate({
                              mqttClientId: o?.mqtt_client_id,
                              // objectId: Number(objectId),
                              switchId,
                              taskId: stateId,
                            });
                          },
                        })),
                    },
                  },
                };
              },
            )
          : [],
      },
      {
        type: 'container',
        title: 'Sensors',
        list: modelData.json_model_full.sensors
          ? Object.entries(modelData.json_model_full.sensors).map(
              ([sensorId, {name, unit}]) => ({
                primaryText: name[lang],
                action: {
                  label: {
                    value: String(liveData?.sensors?.[sensorId]),
                    addition: unit,
                  },
                },
              }),
            )
          : [],
      },
      {
        type: 'container',
        title: 'Lists',
        list: modelData.json_model_full.lists
          ? Object.entries(modelData.json_model_full.lists).map(
              ([listId, {name}]) => ({
                primaryText: name[lang],
                sublist: liveData?.lists?.[listId]?.map(({label, value}) => ({
                  primary: label,
                  value: value,
                })),
              }),
            )
          : [],
      },

      {
        type: 'container',
        list: [
          {
            primaryDisplay: {
              label: 'Last connected time',
              text: o?.connected_at ? o?.connected_at.toString() : ' ',
            },
          },
          {
            primaryDisplay: {
              label: 'Last disconnected time',
              text: o?.disconnected_at ? o?.disconnected_at.toString() : ' ',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <GenericPage pageData={pageData} />
      {/*       <WrapperInner bodyMargin={false} bgTransparent>
        <>
          <ObjectDetailsMenu />
          <List>
            <HeaderObjectOnOff objectId={Number(objectId)} />
          </List>

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{padding: '10px 0px 20px'}}
          >
            <Grid item>
              <Typography align="left" variant="body1" color="textSecondary">
                Components
              </Typography>
            </Grid>
          </Grid>

          <TabComponents objectid={Number(objectId)} />
        </>
      </WrapperInner>
      */}
    </>
  );
};

export default ObjectPage;
