/**
 * Services Index
 *
 * Central export point for all API services.
 * Provides organized access to all service classes and utilities.
 *
 * @module services
 */

// Core API Client
export { default as api, HttpClient, apiConfig } from './api';

// Authentication Service
export { default as authService, AuthService } from './authService';

// Learning Services
export { default as lessonsService, LessonsService } from './lessonsService';
export { default as progressService, ProgressService } from './progressService';
export { default as quizService, QuizService } from './quizService';
export { default as speakingService, SpeakingService } from './speakingService';

// Service Registry for Dependency Injection
const services = {
  api,
  auth: authService,
  lessons: lessonsService,
  progress: progressService,
  quiz: quizService,
  speaking: speakingService
};

// Default export combining all services
export default services;

// Named exports for individual services
export {
  authService as Auth,
  lessonsService as Lessons,
  progressService as Progress,
  quizService as Quiz,
  speakingService as Speech
};

/**
 * Service Factory
 *
 * Provides a factory pattern for creating service instances
 * with dependency injection and configuration.
 *
 * @class ServiceFactory
 */
export class ServiceFactory {

  /**
   * Create all services with shared configuration
   *
   * @returns {Object} All configured service instances
   */
  static createAll() {
    return {
      auth: new AuthService(),
      lessons: new LessonsService(),
      progress: new ProgressService(),
      quiz: new QuizService(),
      speaking: new SpeakingService(),
      api: new HttpClient()
    };
  }

  /**
   * Create a single service instance
   *
   * @param {string} serviceName - Name of the service to create
   * @returns {Object} Service instance
   */
  static create(serviceName) {
    const constructors = {
      auth: AuthService,
      lessons: LessonsService,
      progress: ProgressService,
      quiz: QuizService,
      speaking: SpeakingService,
      api: HttpClient
    };

    const Constructor = constructors[serviceName];
    if (!Constructor) {
      throw new Error(`Unknown service: ${serviceName}`);
    }

    return new Constructor();
  }

  /**
   * Get service configuration
   *
   * @returns {Object} Service configuration
   */
  static getConfig() {
    return apiConfig;
  }

  /**
   * Set global service configuration
   *
   * @param {Object} config - Service configuration
   */
  static setConfig(config) {
    Object.assign(apiConfig, config);
  }
}

/**
 * Service Manager
 *
 * Singleton manager for all services with caching and initialization.
 *
 * @class ServiceManager
 */
export class ServiceManager {
  constructor() {
    this._services = new Map();
    this._initialized = false;
  }

  /**
   * Initialize all services
   *
   * @param {Object} config - Optional configuration
   * @returns {ServiceManager} Self for chaining
   */
  initialize(config = {}) {
    if (config) {
      ServiceFactory.setConfig(config);
    }

    const allServices = ServiceFactory.createAll();
    Object.entries(allServices).forEach(([name, instance]) => {
      this._services.set(name, instance);
    });

    this._initialized = true;
    return this;
  }

  /**
   * Get a service instance
   *
   * @param {string} serviceName - Name of the service
   * @returns {Object} Service instance
   */
  get(serviceName) {
    if (!this._initialized) {
      throw new Error('Service manager not initialized. Call initialize() first.');
    }

    return this._services.get(serviceName);
  }

  /**
   * Check if a service is available
   *
   * @param {string} serviceName - Name of the service
   * @returns {boolean} True if service exists and is initialized
   */
  has(serviceName) {
    return this._initialized && this._services.has(serviceName);
  }

  /**
   * Get all available services
   *
   * @returns {Map} Map of all services
   */
  getAll() {
    if (!this._initialized) {
      throw new Error('Service manager not initialized. Call initialize() first.');
    }

    return new Map(this._services);
  }

  /**
   * Destroy all services and reset manager
   */
  destroy() {
    this._services.clear();
    this._initialized = false;
  }
}

// Create singleton service manager instance
const serviceManager = new ServiceManager();

// Export singleton instance for convenience
export { serviceManager as services };

// Utility functions for service operation
/**
 * Create service registry for dependency injection
 *
 * @param {Array} serviceDeclarations - Array of service declarations
 * @returns {Object} Service registry
 */
export function createServiceRegistry(serviceDeclarations = []) {
  const registry = { ...services };

  serviceDeclarations.forEach(({ name, implementation }) => {
    registry[name] = implementation;
  });

  return registry;
}

/**
 * Inject services into a component or module
 *
 * @param {Array} requiredServices - Array of service names to inject
 * @param {Object} target - Target object to receive services
 * @returns {Object} Target with injected services
 */
export function injectServices(requiredServices, target = {}) {
  requiredServices.forEach(serviceName => {
    if (services[serviceName]) {
      target[serviceName] = services[serviceName];
    } else {
      console.warn(`Required service '${serviceName}' is not available`);
    }
  });

  return target;
}

/**
 * Create service composition with mixin pattern
 *
 * @param {Object} base - Base object to extend
 * @param {Array} serviceNames - Service names to compose
 * @returns {Object} Extended object with service methods
 */
export function composeServices(base = {}, serviceNames = []) {
  const composed = { ...base };

  serviceNames.forEach(serviceName => {
    const service = services[serviceName];
    if (service) {
      Object.getOwnPropertyNames(Object.getPrototypeOf(service))
        .filter(method => typeof service[method] === 'function' && method !== 'constructor')
        .forEach(method => {
          if (!composed[method]) {
            composed[method] = service[method].bind(service);
          }
        });
    }
  });

  return composed;
}