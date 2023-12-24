import {createTRPCReact} from '@trpc/react-query';
import type {AppRouter} from '@remrob/api';
import {createTRPCProxyClient, httpBatchLink} from '@trpc/client';
import superjson from 'superjson';
import {getAppState} from './redux/store';

console.log(
  '>>>',
  process.env.EXPO_PUBLIC_APP_API_HOST,
  process.env.EXPO_PUBLIC_APP_API_PORT,
);

export const trpcClientOptions = {
  links: [
    httpBatchLink({
      url: `${process.env.EXPO_PUBLIC_APP_API_HOST}:${process.env.EXPO_PUBLIC_APP_API_PORT}/trpc`,
      // optional
      headers() {
        const authToken = getAppState().session.sessionToken;
        return {
          authorization: `Bearer ${authToken}`,
        };
      },
    }),
  ],
  transformer: superjson,
};

export const trpcComp = createTRPCReact<AppRouter>();
// trpc.createClient(clientOptions);
// export {trpc};

export const trpcFunc = createTRPCProxyClient<AppRouter>(trpcClientOptions);
