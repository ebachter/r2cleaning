import {Box, Container} from '@mui/system';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  setChatImage,
  setWidgetFullScreen,
  useUtilsStore,
} from '../zustand/utils';
import {trpcFunc} from '../trpc';
import {useAppSelector} from '../hooks/hooksRedux';

const classes = {
  container: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    paddingTop: '56.25%' /* 16:9 Aspect Ratio */,
  },
  responsiveIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    border: '1px solid silver', // 'none',
    backgroundColor: 'white',
  },
};

const GenericPageIframe = ({
  url,
}: // sendDataToFrame,
{
  url: string;
  // sendDataToFrame: (f: () => void) => void;
}) => {
  const [iframeReLoaded, setIframeReLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendToFrame = (data: any) => {
    if (iframeRef?.current?.contentWindow)
      iframeRef.current.contentWindow.postMessage(data, '*');
  };

  const widgetFullscreen = useUtilsStore(
    (state) => state.data.widgetFullscreen,
  );
  // const fifoData = useSelector((state: any) => state.r2live.iframe_fifo);
  const fifoData = useUtilsStore((state) => state.data.iframe_fifo);
  const objectsMasterData = useAppSelector((state) => state.objects);

  useEffect(() => {
    if (fifoData) sendToFrame(fifoData.payload);
  }, [iframeReLoaded, fifoData]);

  useEffect(() => {
    if (objectsMasterData)
      sendToFrame({type: 'objectsMasterData', data: objectsMasterData});
  }, [iframeReLoaded, objectsMasterData]);

  const handleFrameTasks = useCallback(async (e: any) => {
    const {data} = e;
    if (data.type === 'screenshot') {
      setChatImage(data.data);
    }
    if (data.type === 'objectMasterDataUpdate' && !isNaN(data.mqttClientId)) {
      // !isNaN(data.objectId)
      await trpcFunc.trpcAppObjectMasterdataUpdate.mutate({
        mqttClientId: data.mqttClientId,
        // objectId: data.objectId,
        configData: data.data,
      });
    }
    /* if (data.type === 'updateObjectStore') {
        // const models = child.props.getStateByKey('models');
        const {objectId, data: objectData} = data;
        // sendToFrame({ type: 'model', modelid: data.modelid, data: models[data.modelid] });
        // console.log('--objectData--', objectData);
        // dispatch({type: 'UPDATE_USER_OBJECT_DATA', objectId, data: objectData});
        dispatch({
          type: 'OBJECT_MASTER_DATA_UPDATE',
          objectId,
          data: objectData,
        });
      } */
    /* if (data.type === 'exportObjectStore') {
        // const models = child.props.getStateByKey('models');
        const {objectId, data: objectData} = data;
        // sendToFrame({ type: 'model', modelid: data.modelid, data: models[data.modelid] });
        // console.log('--objectData exp--', objectData)
        dispatch({
          type: 'UPDATE_USER_OBJECT_DATA',
          objectId,
          data: objectData,
          export_: true,
        });
      } */
    if (data.oper === 'loadCloudData') {
      // const models = child.props.getStateByKey('models');
      const {objectid, cloudkey, from, to} = data;

      const cloudData = await trpcFunc.loadCloudData.query({
        objectId: objectid,
        cloudKey: cloudkey,
        from,
        to,
      });
      sendToFrame(cloudData);
    }
    if (data.get === 'sensorLogData') {
      const {objectid} = data;
      const sensorData = await trpcFunc.getSensorLogData.query({
        objectId: objectid,
      });
      sendToFrame(sensorData);
    }

    if (data.objectid && data.actorid && data.taskid) {
      const {mqttClientId, objectid, actorid, taskid} = data;
      trpcFunc.sendObjectSwitchTask.mutate({
        mqttClientId,
        // objectId: objectid,
        switchId: actorid,
        taskId: taskid,
      });
    }

    /* if (data.get && data.get === 'listOfObjects') {
        //  const objects = child.props.getStateByKey('objects');
        // console.log('objects', objects);
        // sendToFrame({ objects: props.objectsArray.map(({ objectid, modelid, serialnr, object_name }) => ({ objectid, modelid, serialnr, name: object_name })) });
        // sendToFrame({ type: 'objects', data: Object.entries(objects).map(([objectid, { modelid, serialnr, object_name }]) => ({ objectid, modelid, serialnr, object_name })) });
      } */

    /*if (e.data.type === "bookmark" && e.data.event === "get") {
      sendToFrame({ event: "bookmark", data: props.objectid });
    }*/
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleFrameTasks);

    return () => {
      window.removeEventListener('message', handleFrameTasks);
    };
  }, [handleFrameTasks]);

  useEffect(() => {
    if (widgetFullscreen && iframeRef?.current) {
      iframeRef.current.requestFullscreen();
    }
    setWidgetFullScreen(false);
  }, [widgetFullscreen]);

  return (
    <Container sx={classes.container}>
      <Box
        component="iframe"
        title="WIDGET"
        onLoad={() => {
          setIframeReLoaded(!iframeReLoaded);
        }}
        sx={classes.responsiveIframe}
        src={url}
        ref={iframeRef}
      />
    </Container>
  );
};

export default GenericPageIframe;
