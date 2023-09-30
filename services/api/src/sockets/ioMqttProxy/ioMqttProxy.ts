import {_, verifyUserAuthToken} from '@remrob/utils';
import mqtt from 'mqtt';
import {Namespace} from 'socket.io';
import {getModelData} from './getModelData';
import {
  CommandFromUserToObject,
  NativeInterfaceParams,
  NativeInterfaceTopics,
} from '@remrob/mysql';

export const mqttproxyio = (nspMqttProxy: Namespace) => {
  nspMqttProxy.on('connection', async (socket) => {
    let {sessionToken, mqttClientId, username, password} = socket.handshake
      .auth as {
      sessionToken: string;
      mqttClientId: string;
      username: string;
      password: string;
    };
    const sessionData = verifyUserAuthToken(sessionToken);
    if (!sessionData || !mqttClientId || !username || !password) {
      socket.disconnect(true);
      return;
    }

    console.info('mqtt client connecting...');
    let mapping_out = await getModelData(mqttClientId);
    mapping_out = Object.entries(mapping_out || {}).reduce((o, [k, v]) => {
      const compiled = _.template(v.topic);
      const temp = compiled({MQTT_CLIENT_ID: mqttClientId});
      return {...o, [k]: {...v, topic: temp}};
    }, {});

    const mqttClient = mqtt.connect(process.env.REACT_APP_OBJECTS_HOST!, {
      clientId: mqttClientId,
      username,
      password,
      keepalive: 2000,
      // reconnectPeriod: 0,
    });

    // Listeneing for COMMANDS from USER to OBJECT
    mqttClient.on('message', function (topic, payload) {
      const message = payload?.toString();
      if (topic === 'provision') {
        socket.send(payload?.toString());
      }
      /* if (topic.trim() === 'original') {
      const obj = JSON.parse(message);
      ws.send(
        JSON.stringify({
          buttonid: obj.buttonid,
        }),
      );
      return;
    } */
      let commandToObject: CommandFromUserToObject | null = null;

      // CHECK IF A MAPPING EXISTS FOR REVERS
      // const mappingOut = mapping_out?.[topic];
      const mappingOutID = Object.keys(mapping_out || {}).find(
        (k) =>
          mapping_out?.[k].topic === topic &&
          mapping_out?.[k].payload === message,
      );

      if (mappingOutID) {
        const commandSplit = mappingOutID.split('/');
        if (commandSplit?.[0] === 'button') {
          commandToObject = {
            userId: sessionData.userId,
            command: 'updateButton',
            buttonId: commandSplit?.[1],
          };
        } else if (
          commandSplit?.[0] === 'actor' &&
          commandSplit?.[2] === 'task'
        ) {
          commandToObject = {
            userId: sessionData.userId,
            command: 'updateSwitch',
            switchId: commandSplit?.[1],
            taskId: commandSplit?.[3],
          };
        }
      } else {
        // PARSE OUTGOING (TO SIMULATOR) MQTT MESSAGE to JS OBJECT
        const topicSplit = topic.trim().split('/');
        if (topicSplit[2] === 'button') {
          commandToObject = {
            userId: sessionData.userId,
            command: 'updateButton',
            buttonId: topicSplit[3],
          };
        } else if (topicSplit[2] === 'actor' && topicSplit[4] === 'task') {
          commandToObject = {
            userId: sessionData.userId,
            command: 'updateSwitch',
            switchId: topicSplit[3],
            taskId: message,
          };
        }
      }
      if (commandToObject) socket.send(JSON.stringify(commandToObject));
    });

    mqttClient.on('error', (err) => {
      console.error(err, 'mqtt client error');
      socket.disconnect(true);
    });

    mqttClient.on('close', () => {
      console.info('mqtt client close');
      socket.disconnect(true);
    });

    socket.on('message', async function (message: string) {
      let arr;
      try {
        arr = JSON.parse(message) as NativeInterfaceParams;
        console.log('msg to obj', arr);
        // CONVERT INCOMING (FROM SIMULATOR) MESSAGE INTO MQTT with topic and value
        let topic: NativeInterfaceTopics, value: string;
        if (arr && 'button' in arr && 'state' in arr) {
          topic = `client/${mqttClientId}/button/${arr.button}/state`;
          value = arr.state;
        } else if (arr && 'switch' in arr && 'state' in arr) {
          topic = `client/${mqttClientId}/actor/${arr.switch}/state`;
          value = arr.state;
        } else if (arr && 'sensor' in arr && 'value' in arr) {
          topic = `client/${mqttClientId}/sensor/${arr.sensor}/value`;
          value = String(arr.value);
        } else if (arr && 'latitude' in arr && 'longitude' in arr) {
          topic = `client/${mqttClientId}/geoposition`;
          value = JSON.stringify({
            latitude: arr.latitude,
            longitude: arr.longitude,
          });
        } else if (arr && 'list' in arr && 'items' in arr) {
          topic = `client/${mqttClientId}/list/${arr.list}/value`;
          value = JSON.stringify(arr.items);
        } else {
          console.error('Undefined topic:', mqttClient, message);
          return;
        }
        // mqttClient.publish('original', message);
        if (topic && value) {
          console.log('topic:', topic, 'value:', value);
          mqttClient.publish(topic, value);
        }
      } catch (err) {
        console.error('mqtt proxy error', arr);
      }
    });

    socket.on('disconnect', function () {
      console.info('simulator object ws client closed');
      mqttClient.end();
    });

    socket.on('error', function (err) {
      console.error('simulator object ws client error', err);
      socket.disconnect(true);
    });
  });
};
