import {fileURLToPath} from 'url';
import {dirname} from 'path';
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(__filename);

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
