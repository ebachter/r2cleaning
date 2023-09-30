import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import {LanguageOptions, UserToken} from '@remrob/mysql';

const SECRET = process.env.WS_JWT_SECRET || '';
const saltRounds = 10;

const userSessionExpireTime = '5h'; // https://github.com/vercel/ms

export const createUserSessionToken = ({
  userId,
  lang,
}: {
  userId: number;
  lang: LanguageOptions;
}) => {
  return jwt.sign({userid: userId, userId, language: lang, lang}, SECRET, {
    expiresIn: userSessionExpireTime,
  }); // 60 * 60 * 5
};

export const verifyUserAuthToken = (userAuthToken: string) => {
  try {
    const session = jwt.verify(
      userAuthToken,
      process.env.WS_JWT_SECRET || '',
    ) as UserToken | null;
    return session;
  } catch (_) {
    return null;
  }
};

export const createUserAuthToken = async (password: string) => {
  const passwordHash = await bcrypt.hash(password, saltRounds);
  return passwordHash;
};

export const checkUserPassword = async (
  plainPassword: string,
  userPasswordHash: string,
) => {
  const match = await bcrypt.compare(plainPassword, userPasswordHash);
  return match;
};

export const generateObjectPasswordHash = (password: string) =>
  crypto.createHash('sha256').update(password, 'utf8').digest('hex');
