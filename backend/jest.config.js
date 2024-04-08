module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/integration/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
