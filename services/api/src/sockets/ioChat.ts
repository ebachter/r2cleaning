import {getRedisClient} from '@remrob/mysql';
import {verifyUserAuthToken} from '@remrob/utils';
import {Namespace} from 'socket.io';

const chatio = (nspChat: Namespace) => {
  const allChannelsSub = getRedisClient();
  allChannelsSub.psubscribe('chatuser:*');
  allChannelsSub.on(
    'pmessage',
    (pattern: string, channel: string, message: string) => {
      nspChat.in(channel).emit('message', message);
    },
  );
  // const nsp = io.of('/chat');

  nspChat.on('connection', (socket) => {
    let sessionToken = socket.handshake.auth.sessionToken;
    const sessionData = verifyUserAuthToken(sessionToken);
    socket.join(`chatuser:${sessionData?.userid}`);
    socket.data.session = sessionData;
  });
};

export default chatio;
