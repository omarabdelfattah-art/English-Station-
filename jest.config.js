/**
 * Jest Configuration for English Learning App
 *
 * Comprehensive testing setup with React Testing Library
 * and Jest for unit and integration testing.
 */

module.exports = {
  // Use jsdom environment for DOM testing
  testEnvironment: 'jsdom',

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Module name mapping for CSS and assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },

  // Transform files with babel-jest
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  // Module directories
  moduleDirectories: ['node_modules', 'src'],

  // Test match patterns
  testMatch: [
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/setupTests.js',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'junit.xml'
    }]
  ]
};