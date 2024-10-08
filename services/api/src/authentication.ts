export type LanguageOptions = 'en' | 'de';
export type UserToken = {
  userid: number;
  userId: number;
  language: LanguageOptions;
  lang: LanguageOptions;
};

import jwt from 'jsonwebtoken';

const SECRET = Bun.env.WS_JWT_SECRET || '';
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
      Bun.env.WS_JWT_SECRET || '',
    ) as UserToken | null;
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
