/**
 * Core API Service Module
 *
 * This module provides the foundational HTTP client and error handling
 * for all API services. It includes request/response interceptors,
 * authentication management, and centralized error processing.
 *
 * Features:
 * - Axios configuration for different environments
 * - Automatic token refresh and authentication
 * - Standardized error handling and response processing
 * - Environment-specific API base URL configuration
 * - Request/response logging and debugging
 */

import axios from 'axios';

/**
 * Environment Configuration
 * @typedef {Object} EnvConfig
 * @property {string} API_URL - Base API URL for the application
 * @property {boolean} DEBUG_MODE - Whether to enable debug logging
 * @property {number} REQUEST_TIMEOUT - Request timeout in milliseconds
 */
const config = {
  API_URL: process.env.REACT_APP_API_URL || 'https://eng-ksce2gie7-omar-ibrahims-projects-9b9b5ebb.vercel.app/api',
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  REQUEST_TIMEOUT: 30000, // 30 seconds
};

/**
 * HttpClient Class
 *
 * Provides a centralized HTTP client with authentication, logging,
 * and error handling capabilities.
 *
 * @class HttpClient
 * @property {Object} instance - Axios instance with interceptors
 * @property {boolean} isRefreshing - Flag to prevent multiple token refreshes
 * @property {Array} requestQueue - Queue for requests waiting for token refresh
 */
class HttpClient {
  constructor() {
    this.instance = axios.create({
      baseURL: config.API_URL,
      timeout: config.REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.isRefreshing = false;
    this.requestQueue = [];

    this.setupInterceptors();
  }

  /**
   * Setup Axios Request and Response Interceptors
   * @private
   */
  setupInterceptors() {
    // Request Interceptor
    this.instance.interceptors.request.use(
      this.handleRequestSuccess.bind(this),
      this.handleRequestError.bind(this)
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      this.handleResponseSuccess.bind(this),
      this.handleResponseError.bind(this)
    );
  }

  /**
   * Handle successful requests
   * @param {Object} config - Axios request config
   * @returns {Object} Modified config
   */
  handleRequestSuccess(config) {
    // Add authentication token if available
    const user = this.getStoredUser();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    // Log requests in debug mode
    if (config.DEBUG_MODE) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
      });
    }

    return config;
  }

  /**
   * Handle request errors
   * @param {Error} error - Request error
   * @returns {Promise} Rejected promise with error
   */
  handleRequestError(error) {
    if (config.DEBUG_MODE) {
      console.error('Request Error:', error);
    }
    return Promise.reject(error);
  }

  /**
   * Handle successful responses
   * @param {Object} response - Axios response
   * @returns {Object} Response data or full response
   */
  handleResponseSuccess(response) {
    if (config.DEBUG_MODE) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    // Return response data instead of full response for cleaner API
    return response.data;
  }

  /**
   * Handle response errors with authentication refresh logic
   * @param {Error} error - Response error
   * @returns {Promise} Rejected promise or refreshed request
   */
  async handleResponseError(error) {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry for login requests
      if (originalRequest.url?.includes('/login')) {
        this.handleAuthenticationFailure();
        return Promise.reject(error);
      }

      return this.handleTokenRefresh(originalRequest, error);
    }

    // Handle other HTTP errors
    this.handleHttpError(error);

    return Promise.reject(error);
  }

  /**
   * Handle token refresh for expired tokens
   * @param {Object} originalRequest - Original failed request
   * @param {Error} error - Response error
   * @returns {Promise} Refreshed request or rejection
   */
  async handleTokenRefresh(originalRequest, error) {
    if (this.isRefreshing) {
      // Queue request while refreshing
      return new Promise((resolve, reject) => {
        this.requestQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    this.isRefreshing = true;
    const user = this.getStoredUser();

    try {
      if (user && user.refreshToken) {
        // Attempt to refresh token
        const response = await axios.post(`${config.API_URL}/auth/refresh-token`, {
          refreshToken: user.refreshToken,
        });

        if (response.data.token) {
          const updatedUser = {
            ...user,
            token: response.data.token,
          };

          this.updateStoredUser(updatedUser);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          originalRequest._retry = true;

          return this.instance(originalRequest);
        }
      }

      // Token refresh failed
      this.handleAuthenticationFailure();
      return Promise.reject(error);
    } catch (refreshError) {
      this.handleAuthenticationFailure();
      this.processQueuedRequests(refreshError);
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Process queued requests after token refresh
   * @param {Error} error - Error if token refresh failed
   */
  processQueuedRequests(error) {
    this.requestQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else {
        resolve(this.instance(config));
      }
    });
    this.requestQueue = [];
  }

  /**
   * Handle authentication failure
   */
  handleAuthenticationFailure() {
    this.updateStoredUser(null);
    window.location.href = '/login';
  }

  /**
   * Handle HTTP errors with appropriate logging
   * @param {Error} error - HTTP error
   */
  handleHttpError(error) {
    if (config.DEBUG_MODE) {
      console.error('Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        message: error.message,
      });
    }
  }

  /**
   * Get stored user from localStorage
   * @returns {Object|null} User object or null
   */
  getStoredUser() {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  /**
   * Update stored user in localStorage
   * @param {Object|null} user - User object to store or null to remove
   */
  updateStoredUser(user) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  /**
   * Make HTTP GET request
   * @param {string} url - Request URL
   * @param {Object} config - Additional config
   * @returns {Promise} Response data
   */
  get(url, config = {}) {
    return this.instance.get(url, config);
  }

  /**
   * Make HTTP POST request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Additional config
   * @returns {Promise} Response data
   */
  post(url, data, config = {}) {
    return this.instance.post(url, data, config);
  }

  /**
   * Make HTTP PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Additional config
   * @returns {Promise} Response data
   */
  put(url, data, config = {}) {
    return this.instance.put(url, data, config);
  }

  /**
   * Make HTTP PATCH request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Additional config
   * @returns {Promise} Response data
   */
  patch(url, data, config = {}) {
    return this.instance.patch(url, data, config);
  }

  /**
   * Make HTTP DELETE request
   * @param {string} url - Request URL
   * @param {Object} config - Additional config
   * @returns {Promise} Response data
   */
  delete(url, config = {}) {
    return this.instance.delete(url, config);
  }
}

// Create and export singleton instance
const httpClient = new HttpClient();

export default httpClient;
export { HttpClient };
export { config as apiConfig };
