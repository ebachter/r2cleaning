import {CommandToUser, ObjectLive} from '@remrob/mysql';
import {io, Socket} from 'socket.io-client';
import {getAppState} from '../redux/store';
import {logout} from '../redux/functionsDispatch';
import {navigate} from '../RootNavigation';
import {trpcFunc} from '../trpc';
// import {getFingerprint, setIframeFifo} from '../zustand/utils';
// import {liveDataSet, liveObjectDisconnected} from '../redux/sliceLiveData';
// import {callAppObjectsLoad, callProjectsLoad} from '../utils/trpcCalls';
// import {enqueueSnackbar} from 'notistack';

let socket: Socket | null;

export const connectMainSocket = () => {
  if (socket?.connected) {
    console.log('socket already connected');
    return;
  } else {
    console.log('connecting...');
  }
  socket = io(
    `${process.env.EXPO_PUBLIC_APP_API_HOST}:${process.env.EXPO_PUBLIC_APP_API_PORT}/main`,
    {
      auth: {
        sessionToken: getAppState().session.sessionToken,
        fingerprint: 'getFingerprint()',
      },
    },
  );

  socket.on('connect', () => {
    console.log('ws connected');
  });

  /* socket?.on('hello', (socket) => {
    socket.emit('hello', 'world');
    setInterval(function () {
      socket.emit('news_by_server', 'Cow goes moo');
    }, 2000);
  }); */

  socket?.on('hello', (message) => {
    try {
      console.log('message', message);
      const payload = message as
        | ({objectId: number} & (ObjectLive | {live: ObjectLive}))
        | CommandToUser;
      // | {objectId: number; listId: string; listData: string};
      if (
        'objectId' in payload &&
        'event' in payload &&
        payload.event === 'disconnected'
      ) {
        // liveObjectDisconnected({objectId: payload.objectId});
      }
      if ('objectId' in payload && 'live' in payload && payload.live) {
        console.log('payload->', {objectId: payload.objectId, ...payload.live});
        // liveDataSet({objectId: payload.objectId, ...payload.live});
      }
      const tempData1 = payload as unknown;
      const tempData = tempData1 as {
        objectId: number;
        listId: string;
        listData: string;
      };
      if (
        'objectId' in payload &&
        'listId' in payload &&
        'listData' in payload
      ) {
        // console.log('+++', message, JSON.parse(payload));
        const list = JSON.parse(
          tempData.listData,
        ) as ObjectLive['lists'][string];
        const data = {
          objectId: tempData.objectId,
          lists: {
            [tempData.listId]: list,
          },
        } as {objectId: number} & ObjectLive;
        // liveDataSet(data);
      }
      const getKey = () => new Date().getTime() + Math.random();
      // if ('objectId' in payload) {
      //  liveDataSet(payload);
      // } else
      if ('commands' in payload) {
        // if (payload.commands.includes('reloadObjects')) callAppObjectsLoad();
        // if (payload.commands.includes('reloadProjects')) callProjectsLoad();
        if ('message' in payload) {
          //enqueueSnackbar(payload.message, {variant: 'info'});
          console.log('iomsg', payload.message, {variant: 'info'});
        }
      }
      // setIframeFifo({payload, key: getKey()});
    } catch (e) {
      console.error(e);
      return false;
    }
  });

  socket.on('disconnect', async (reason) => {
    console.log('Disconnecting socket...', reason);
    logout();
    const check = await trpcFunc.authCheckToken.query();
    console.log('--check--', check);

    if (reason === 'io server disconnect') {
      console.log('DisconLog me out...', reason);
      // fnUserLogout();
    }
    socket?.removeAllListeners();
  });

  socket.on('close', (reason) => {
    console.log('IO Close...', reason);

    // called when the underlying connection is closed
  });
};

export const disconnectMainSocket = () => {
  if (socket) socket.close();
};
