import jwt from 'jsonwebtoken';
import {Session} from './types';

const SECRET = Bun.env.WS_JWT_SECRET || '';
const saltRounds = 10;

const userSessionExpireTime = '5h'; // https://github.com/vercel/ms

export const createUserSessionToken = ({userId, language}: Session) => {
  return jwt.sign({userId, language}, SECRET, {
    expiresIn: userSessionExpireTime,
  }); // 60 * 60 * 5
};

export const verifyUserAuthToken = (userAuthToken: string) => {
  try {
    const session = jwt.verify(
      userAuthToken,
      Bun.env.WS_JWT_SECRET || '',
    ) as Session | null;
    return session;
  } catch (_) {
    return null;
  }
};

export const createUserAuthToken = async (password: string) => {
  //const passwordHash = await bcrypt.hash(password, saltRounds);
  const passwordHash = await Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 4, // number between 4-31
  });
  return passwordHash;
};

export const checkUserPassword = async (
  plainPassword: string,
  userPasswordHash: string,
) => {
  // const match = await bcrypt.compare(plainPassword, userPasswordHash);
  const match = await Bun.password.verify(plainPassword, userPasswordHash);
  return match;
};
