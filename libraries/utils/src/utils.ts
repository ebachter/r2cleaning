// import * as types from './types';
// export type LanguageOptions = types.LanguageOptions;
// export type UserToken = types.UserToken;

import {
  createUserAuthToken,
  createUserSessionToken,
  checkUserPassword,
  verifyUserAuthToken,
  generateObjectPasswordHash,
} from './authentication';

export {
  createUserAuthToken,
  createUserSessionToken,
  checkUserPassword,
  verifyUserAuthToken,
  generateObjectPasswordHash,
};

export * from './jsPure';
import _ from 'lodash';
export {_};
