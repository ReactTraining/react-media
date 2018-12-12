let mappedModule;
switch (process.env.TEST_ENV) {
  case 'cjs':
    mappedModule = '<rootDir>/cjs/react-media.js';
    break;
  case 'umd':
    mappedModule = '<rootDir>/umd/react-media.js';
    break;
  case 'source':
  default:
    mappedModule = '<rootDir>/modules/index.js';
}

module.exports = {
  globals: {
    __DEV__: true
  },
  moduleNameMapper: {
    '^react-media$': mappedModule
  },
  testMatch: ['**/__tests__/**/*-test.js'],
  testURL: 'http://localhost/'
};
