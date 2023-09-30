import {io, Socket} from 'socket.io-client';
import {getAppState} from '../redux/store';
import {CommandFromUserToObject, NativeInterfaceParams} from '@remrob/mysql';

let socket: Socket | null;

export const connectToObject = (
  mqtt_client_id: string,
  mqtt_user_name: string,
  password: string,
) => {
  socket = io(`${process.env.REACT_APP_API_ORIGIN}/mqttproxy`, {
    auth: {
      sessionToken: getAppState().session.sessionToken,
      mqttClientId: mqtt_client_id,
      username: mqtt_user_name,
      password,
    },
    reconnection: false,
  });
  // console.log(`Connecting socket...`);
};

export const subscribeToCommands = (
  cb: (err: any, msg: CommandFromUserToObject) => void,
) => {
  socket?.on('message', (msg) => {
    const data = JSON.parse(msg);

    return cb(null, data);
  });
};
export const executeOnConnect = (cb: () => void) => {
  socket?.on('connect', () => {
    return cb();
  });
};
export const executeOnDisconnect = (cb: () => void) => {
  socket?.on('disconnect', () => {
    return cb();
  });
};
export const sendUpdatesToUsers = (msg: NativeInterfaceParams) => {
  socket?.emit('message', JSON.stringify(msg));
};

export const disconnectFromObject = () => {
  // console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};
