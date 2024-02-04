import {getRedisClient, sharedObjectsGet} from '@remrob/mysql';
import {verifyUserAuthToken} from '@remrob/utils';
import {Namespace} from 'socket.io';
// import updateUserActivity from './updateUserActivity';

const mainio = (nspMain: Namespace) => {
  const redisClient = getRedisClient();
  const allChannelsSub = getRedisClient();
  allChannelsSub.psubscribe('toUser:*');
  allChannelsSub.on(
    'pmessage',
    (pattern: string, channel: string, message: string) => {
      nspMain.in(channel).emit('message', message);
    },
  );
  // const nsp = io.of('/chat');

  nspMain.on('connection', async (socket) => {
    console.log('--connected--');
    socket.emit('hello', {name: 'John'});
    setTimeout(function () {
      socket.emit('hello', {name: 'Wallca'});
    }, 2000);

    let {sessionToken, fingerprint} = socket.handshake.auth as {
      sessionToken: string;
      fingerprint: string;
    };
    const sessionData = verifyUserAuthToken(sessionToken);
    // console.log('--sessionToken--', sessionToken);
    if (!sessionData) {
      socket.disconnect(true);
      return;
    }

    const objects = await sharedObjectsGet(sessionData.userId, {
      object_id: true,
    });
    /* const objects = await prisma.objects.findMany({
      select: {object_id: true},
      where: {user_fk: sessionData?.userid},
    }); */
    const multi2 = redisClient.multi();
    objects.forEach(({object_id}) => {
      multi2.call('JSON.get', `object-${object_id}`);
    });
    const replies2 = await multi2.exec();
    replies2?.forEach((val, i) => {
      if (val[1]) {
        socket.emit(
          'message',
          `{"objectId": ${objects[i].object_id}, "live": ${val[1]}}`,
        );
      }
    });

    socket.join(`toUser:${sessionData?.userid}`);
    socket.data.session = sessionData;
    // updateUserActivity(sessionData.userid, fingerprint, socket.id, 'connected');

    socket.on('close', (reason) => {
      console.log('--disconnected--');
      /* updateUserActivity(
        sessionData.userid,
        fingerprint,
        socket.id,
        'disconnected',
      ); */
    });
  });
};

export default mainio;
