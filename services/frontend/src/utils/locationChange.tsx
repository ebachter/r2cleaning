import {History} from 'history';
import history from '../redux/history';
import {getAppState} from '../redux/store';
import {connectMainSocket, disconnectMainSocket} from '../sockets/ioMain';

const protectedRoutes = [
  '/objects',
  '/widgets',
  '/projects',
  '/services',
  '/settings',
  '/timeline',
  '/analytics',
  '/search',
  '/admin',
];

const locationChange = (location: History['location'], unmounting: boolean) => {
  if (unmounting) {
    disconnectMainSocket();
    return;
  }
  const authToken = getAppState().session.sessionToken;
  const {pathname} = location;

  if (protectedRoutes.some((s) => pathname?.startsWith(s))) {
    if (!authToken) {
      history.push(
        pathname === '/objects' ? '/login' : `/login?redirect=${pathname}`,
      );
    } else {
      connectMainSocket();
    }
  }

  if (pathname === '/login') {
    if (authToken) {
      const query = new URLSearchParams(location.search);
      const redirectUrl = query.get('redirect');
      // yield * select((s) => s.router.location.query.redirect);

      history.replace(
        redirectUrl ? decodeURIComponent(redirectUrl) : '/objects',
      );
    }
  }

  if (
    pathname === '/' ||
    ['/signup', '/reset'].some((s) => pathname.startsWith(s))
  ) {
    if (authToken) {
      history.replace('/objects');
    }
  }
};

export default locationChange;
