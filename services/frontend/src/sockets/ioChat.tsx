import {io, Socket} from 'socket.io-client';
import {getAppState} from '../redux/store';

let socket: Socket | null;

export const connectSocket = () => {
  socket = io(
    `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/chat`,
    {
      auth: {
        sessionToken: getAppState().session.sessionToken,
      },
    },
  );
};

export const subscribeToChat = (cb: (err: any, msg: any) => void) => {
  socket?.on('message', (msg) => {
    return cb(null, msg);
  });
};
export const postChatMessage = (msg: string) => {
  socket?.emit('message', msg);
};

export const disconnectSocket = () => {
  // console.log('Disconnecting socket...');
  if (socket) socket.disconnect();
};
