// eslint-disable-next-line import/unambiguous, import/no-commonjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  timers: 'fake',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/',
    '<rootDir>/examples',
    'lib/',
    'node_modules/',
    '__integration__',
  ],
};
