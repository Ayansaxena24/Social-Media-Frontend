module.exports = {
  preset: 'ts-jest',  // Use ts-jest preset for TypeScript support
  testEnvironment: 'jsdom', // Needed for DOM-related tests
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript files
  },
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
