import * as trpcExpress from '@trpc/server/adapters/express';
import {verifyUserAuthToken} from '@remrob/utils';

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    accessToken = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.access_token) {
    accessToken = req.cookies.access_token;
  }

  const notAuthenticated = {
    req,
    res,
    session: null,
  };

  if (!accessToken) {
    return notAuthenticated;
  }

  const decodedData = verifyUserAuthToken(accessToken);

  if (!decodedData) {
    return notAuthenticated;
  }

  const session = decodedData;
  return {req, session};
}; // no context

export type Context = Awaited<ReturnType<typeof createContext>>;
