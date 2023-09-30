import {io, Socket} from 'socket.io-client';
import {getAppState} from '../redux/store';

let socket: Socket | null;

export const ioSearchObjectConnect = (objectId: number) => {
  socket = io(
    `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/market/object`,
    {
      auth: {
        sessionToken: getAppState().session.sessionToken,
      },
      query: {
        objectId,
      },
      forceNew: true,
    },
  );
  // console.log(`Connecting socket...`);
};

export const ioSearchObjectSubscribe = (cb: (err: any, msg: any) => void) => {
  socket?.on('message', (msg) => {
    return cb(null, msg);
  });
};

export const postChatMessage = (msg: string) => {
  socket?.emit('message', msg);
};

export const ioSearchObjectDisconnect = () => {
  // console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};
