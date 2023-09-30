/** @typedef {import('ts-jest')} */
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  collectCoverage: false,
  collectCoverageFrom: ['**/src/**'],
  coverageReporters: ['lcov', 'json'],
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '\\.(test|spec)\\.(ts|js)$',
  transform: {
    '\\.ts$': 'ts-jest',
  },
};

module.exports = config;
