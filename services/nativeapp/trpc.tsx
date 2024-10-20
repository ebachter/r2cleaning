import type {AppRouter} from '@remrob/api';
import {
  createWSClient,
  httpLink,
  loggerLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import {createTRPCReact} from '@trpc/react-query';
import superjson from 'superjson';
import {getAppState} from './redux/store';

import {TRPCLink} from '@trpc/client';
import {observable} from '@trpc/server/observable';

export const trpc = createTRPCReact<AppRouter>();
// trpc.createClient(clientOptions);
// export {trpc};

export const customLink: TRPCLink<AppRouter> = () => {
  // here we just got initialized in the app - this happens once per app
  // useful for storing cache for instance
  return ({next, op}) => {
    // this is when passing the result to the next link
    // each link needs to return an observable which propagates results
    return observable((observer) => {
      // console.log('performing operation:', op);
      const unsubscribe = next(op).subscribe({
        next(value) {
          // console.log('we received value', value);
          observer.next(value);
        },
        error(err) {
          if (err.message === 'UNAUTHORIZED') {
            console.log('auth error', err.cause, err.message, err.data);
            observer.complete();
            // logout();
          } else {
            console.log('unknown error', err.cause, err.message);
            observer.error(err);
          }
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

export const trpcClientOptions = {
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === 'development' &&
          typeof window !== 'undefined') ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    customLink,

    splitLink({
      condition: (op) => op.type === 'subscription',
      true: wsLink({
        client: createWSClient({
          lazy: {enabled: true, closeMs: 0}, // https://github.com/trpc/trpc/discussions/2672
          url: `${process.env.EXPO_PUBLIC_APP_API_HOST}`,
          connectionParams: async () => {
            const authToken = getAppState().session.sessionToken;
            return {
              token: authToken,
            };
          },
          onOpen: () => {
            console.log('wsOpen');
          },
          onClose: () => {
            console.log('wsClose');
          },
        }),
        transformer: superjson,
      }),

      false: httpLink({
        url: `${process.env.EXPO_PUBLIC_APP_API_HOST}`,
        headers() {
          const authToken = getAppState().session.sessionToken;
          return {
            authorization: `Bearer ${authToken}`,
          };
        },
        transformer: superjson,
      }),
    }),
  ],
};
