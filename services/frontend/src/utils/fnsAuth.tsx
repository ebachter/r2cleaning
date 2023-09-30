import {objectsClear} from '../redux/sliceObjects';
import {sessionSet} from '../redux/sliceSession';
import {disconnectMainSocket} from '../sockets/ioMain';
import {BroadcastChannel} from 'broadcast-channel';
import history from '../redux/history';
import {appContactsLoad, callAppWidgetsLoad} from './trpcCalls';
import {callAppObjectsLoad} from './trpcCalls';
import {
  callUserDataLoad,
  callProjectsLoad,
  callAppServicesLoad,
} from './trpcCalls';

const kickoutChannel = new BroadcastChannel('kickout-event');

async function fullUserDataLoad() {
  await Promise.all([callUserDataLoad(), callAppObjectsLoad()]);

  callAppWidgetsLoad();
  callProjectsLoad();
  appContactsLoad();
  callAppServicesLoad();
}

export async function fnUserLogin() {
  await fullUserDataLoad();

  const query = new URLSearchParams(history.location.search);
  const redirectUrl = query.get('redirect');
  history.replace(redirectUrl ? decodeURIComponent(redirectUrl) : '/objects');
}

export async function fnUserLogout(args: {withRedirect?: boolean} = {}) {
  const {withRedirect} = args;
  sessionSet({sessionToken: null, refreshToken: null});
  const {pathname, search} = history.location;
  const urlParam =
    !withRedirect || pathname === '/objects' || !pathname
      ? null
      : encodeURIComponent(`${pathname}${search}`);
  const newPath = urlParam ? `/login?redirect=${urlParam}` : '/';
  history.replace(newPath);

  kickoutChannel.postMessage('kickout');
  disconnectMainSocket();
  objectsClear();
}
