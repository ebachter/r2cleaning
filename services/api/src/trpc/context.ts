import type {CreateNextContextOptions} from '@trpc/server/adapters/next';
import {verifyUserAuthToken} from '../authentication';

export const createContext = async ({
  req,
  res,
  info,
}: CreateNextContextOptions) => {
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    accessToken = req.headers.authorization.split(' ')[1];
  } else if (info.connectionParams?.token) {
    accessToken = info.connectionParams?.token;
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
