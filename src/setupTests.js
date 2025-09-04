/**
 * Jest Setup File
 *
 * Global test configuration and setup for React Testing Library
 * Includes custom matchers, global test utilities, and environment setup.
 */

// Import jest-dom for additional matchers
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

// Mock window.sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.sessionStorage = sessionStorageMock;

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Mock window.alert
global.alert = jest.fn();

// Global test utilities
global.testUtils = {
  // Helper to create mock Redux store
  createMockStore: (initialState = {}) => ({
    getState: () => initialState,
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  }),

  // Helper to render components with Redux Provider
  renderWithRedux: (component, initialState = {}) => {
    const mockStore = global.testUtils.createMockStore(initialState);
    return {
      ...render(
        <Provider store={mockStore}>
          {component}
        </Provider>
      ),
      store: mockStore,
    };
  },

  // Helper to wait for async operations
  waitForAsync: () => new Promise(resolve => setTimeout(resolve, 0)),

  // Common test data
  mockUser: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    level: 'A1',
    progress: 30,
    streak: 7,
    isOnboarded: true,
    placementTestCompleted: true,
  },

  mockLesson: {
    id: 1,
    title: 'Basic Greetings',
    level: 'A1',
    completed: false,
    description: 'Learn essential greetings and introductions',
  },
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});