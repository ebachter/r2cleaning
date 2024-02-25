import {createTRPCReact} from '@trpc/react-query';
import type {AppRouter} from '@remrob/api';
import {createTRPCProxyClient, httpBatchLink, loggerLink} from '@trpc/client';
import superjson from 'superjson';
import {getAppState} from './redux/store';

// console.log(
//   '>>>',
//   process.env.EXPO_PUBLIC_APP_API_HOST,
//   process.env.EXPO_PUBLIC_APP_API_PORT,
// );
import {TRPCLink} from '@trpc/client';
import {observable} from '@trpc/server/observable';
import {logout} from './redux/functionsDispatch';

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
            logout();
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
    httpBatchLink({
      url: `${process.env.EXPO_PUBLIC_APP_API_HOST}:${process.env.EXPO_PUBLIC_APP_API_PORT}/trpc`,

      headers() {
        const authToken = getAppState().session.sessionToken;
        return {
          authorization: `Bearer ${authToken}`,
        };
      },

      /* async fetch(url, options) {
        const headers = options?.headers as Record<string, any>;

        if (headers && headers['X-Trpc-Fetch-Ops']) {
          console.log('FETCH OPS', headers['X-Trpc-Fetch-Ops']);
          delete headers['X-Trpc-Fetch-Ops'];
        }

        console.log('FETCH ARGS', options);
        return fetch(url, options);
      }, */
    }),
  ],
  transformer: superjson,
};

export const trpcComp = createTRPCReact<AppRouter>();
// trpc.createClient(clientOptions);
// export {trpc};

export const trpcFunc = createTRPCProxyClient<AppRouter>(trpcClientOptions);
