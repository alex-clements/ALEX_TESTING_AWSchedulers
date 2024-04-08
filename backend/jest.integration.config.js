module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/integration/*.test.js'], // Uses .js for IDE code completion
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/unit/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globalSetup: './test/integration/config/setup.ts',
  globalTeardown: './test/integration/config/teardown.ts',
};
