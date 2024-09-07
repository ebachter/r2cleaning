import '@azure/core-asynciterator-polyfill';
// RNEventSource extends EventSource's functionality, you can add this to make the typing reflect this but it's not a requirement

import type {AppRouter} from '@remrob/api';
import {
  httpBatchLink,
  loggerLink,
  splitLink,
  unstable_httpSubscriptionLink,
} from '@trpc/client';
import {
  createTRPCReact,
  inferReactQueryProcedureOptions,
} from '@trpc/react-query';
// import {EventSourcePolyfill} from 'event-source-polyfill';
import superjson from 'superjson';
import {getAppState} from './redux/store';

// polyfill EventSource
// globalThis.EventSource = EventSourcePolyfill;

/* declare global {
  interface EventSource extends RNEventSource {}
} */

type MaybePromise<TValue> = TValue | Promise<TValue>;
type CallbackOrValue<TValue> = TValue | (() => MaybePromise<TValue>);

// globalThis.EventSource = RNEventSource as unknown as typeof EventSource;
// globalThis.ReadableStream = globalThis.ReadableStream || ReadableStream;
// globalThis.TransformStream = globalThis.TransformStream || TransformStream;

// console.log(
//   '>>>',
//   process.env.EXPO_PUBLIC_APP_API_HOST,
//   process.env.EXPO_PUBLIC_APP_API_PORT,
// );
import {TRPCLink} from '@trpc/client';
import {observable} from '@trpc/server/observable';
import {inferRouterInputs, inferRouterOutputs} from '@trpc/server';

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
      true: unstable_httpSubscriptionLink({
        url: `${process.env.EXPO_PUBLIC_APP_API_HOST}:${process.env.EXPO_PUBLIC_APP_API_PORT}/trpc`,
        // options to pass to the EventSourcePolyfill constructor
        eventSourceOptions: (async () => {
          return {
            headers: {
              authorization: 'Bearer supersecret',
            },
          }; // you either need to typecast to `EventSourceInit` or use `as any` or override the types by a `declare global` statement
        }) as CallbackOrValue<EventSourceInit>,
        transformer: superjson,
      }),
      false: httpBatchLink({
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
        transformer: superjson,
      }),
    }),
  ],
};

// infer the types for your router
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const trpcComp = createTRPCReact<AppRouter>();
// trpc.createClient(clientOptions);
// export {trpc};
