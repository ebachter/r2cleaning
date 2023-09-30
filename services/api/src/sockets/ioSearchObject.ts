import {getRedisClient} from '@remrob/mysql';
import {verifyUserAuthToken} from '@remrob/utils';
import {Namespace} from 'socket.io';

const ioSearchObject = (nspChat: Namespace) => {
  const allChannelsSub = getRedisClient();
  allChannelsSub.psubscribe('pblobj:*');
  allChannelsSub.on(
    'pmessage',
    (pattern: string, channel: string, message: string) => {
      nspChat.in(channel).emit('message', message);
    },
  );
  // const nsp = io.of('/chat');

  nspChat.on('connection', (socket) => {
    const objectId = socket.handshake.query.objectId;
    let sessionToken = socket.handshake.auth.sessionToken;
    const sessionData = verifyUserAuthToken(sessionToken);
    if (!objectId || !sessionData) socket.disconnect(true);
    socket.data.session = sessionData;
    socket.join(`pblobj:${objectId}`);
  });
};

export default ioSearchObject;
