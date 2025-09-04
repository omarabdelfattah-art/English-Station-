/**
 * Authentication Service
 *
 * Provides all authentication-related API operations including
 * user registration, login, logout, profile management, and
 * onboarding flow management.
 *
 * @module authService
 */

import api from './api';
import supabase from './supabase';

/**
 * Authentication Service Class
 *
 * Handles all authentication operations with improved error handling
 * and data management.
 *
 * @class AuthService
 */
class AuthService {

  /**
   * Register a new user account
   *
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} User data with authentication token
   */
  async register(userData) {
    try {
      const { name, email, password } = userData;
      
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Store user data
      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name,
          token: data.session?.access_token,
          refreshToken: data.session?.refresh_token
        };
        
        this._storeUserData(userData);
      }
      
      return data;
    } catch (error) {
      this._handleAuthError(error, 'Registration failed');
      throw error;
    }
  }

  /**
   * Authenticate user with email and password
   *
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} User data with authentication token
   */
  async login(credentials) {
    try {
      const { email, password } = credentials;
      
      // Login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // Store user data
      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          token: data.session?.access_token,
          refreshToken: data.session?.refresh_token
        };
        
        this._storeUserData(userData);
      }
      
      return data;
    } catch (error) {
      this._handleAuthError(error, 'Login failed');
      throw error;
    }
  }

  /**
   * Logout current user and clear stored data
   *
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Logout with Supabase Auth
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn('Supabase logout failed:', error);
      }
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      // Always clear local user data
      this._clearUserData();
    }
  }

  /**
   * Update user profile information
   *
   * @param {Object} userData - Updated user profile data
   * @param {string} [userData.name] - Updated name
   * @param {string} [userData.email] - Updated email
   * @param {string} [userData.profilePicture] - Profile picture URL
   * @returns {Promise<Object>} Updated user profile data
   */
  async updateProfile(userData) {
    try {
      const response = await api.put('/users/' + this._getStoredUser().id, userData);

      if (response) {
        this._storeUserData(response);
      }

      return response;
    } catch (error) {
      this._handleAuthError(error, 'Profile update failed');
      throw error;
    }
  }

  /**
   * Complete user onboarding process
   *
   * @returns {Promise<Object>} Updated user data with onboarding completed
   */
  async completeOnboarding() {
    try {
      const response = await api.put('/users/' + this._getStoredUser().id + '/onboarding', {});

      if (response) {
        this._storeUserData(response);
      }

      return response;
    } catch (error) {
      this._handleAuthError(error, 'Onboarding completion failed');
      throw error;
    }
  }

  /**
   * Complete placement test and set user level
   *
   * @param {Object} testData - Placement test results
   * @param {string} testData.level - Determined English level (A1, A2, B1, B2, C1, C2)
   * @param {number} testData.score - Test score percentage
   * @returns {Promise<Object>} Updated user data with level and test completion
   */
  async completePlacementTest(testData) {
    try {
      const response = await api.put('/users/' + this._getStoredUser().id + '/placement-test', testData);

      if (response) {
        this._storeUserData(response);
      }

      return response;
    } catch (error) {
      this._handleAuthError(error, 'Placement test completion failed');
      throw error;
    }
  }

  /**
   * Refresh authentication token using refresh token
   *
   * @returns {Promise<Object>} New authentication tokens
   */
  async refreshToken() {
    try {
      // Refresh session with Supabase Auth
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      // Update stored user data
      if (data.session) {
        const user = this._getStoredUser();
        const updatedUser = {
          ...user,
          token: data.session.access_token,
          refreshToken: data.session.refresh_token
        };
        
        this._storeUserData(updatedUser);
      }
      
      return data;
    } catch (error) {
      this._handleAuthError(error, 'Token refresh failed');
      throw error;
    }
  }

  /**
   * Get current authenticated user data
   *
   * @returns {Object|null} Current user data or null if not authenticated
   */
  async getCurrentUser() {
    try {
      // Get current session from Supabase
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }
      
      // Update stored user data if needed
      if (data.user) {
        const storedUser = this._getStoredUser();
        const updatedUser = {
          ...storedUser,
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          token: storedUser?.token
        };
        
        this._storeUserData(updatedUser);
        return updatedUser;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated with valid token
   *
   * @returns {boolean} True if user is authenticated
   */
  async isAuthenticated() {
    try {
      // Check if there's an active session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      return !!data.session;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }

  /**
   * Check if user has administrator privileges
   *
   * @returns {boolean} True if user is admin
   */
  isAdmin() {
    const user = this._getStoredUser();
    return !!(user && user.role === 'admin');
  }

  /**
   * Request password reset email
   *
   * @param {string} email - Email address for password reset
   * @returns {Promise<Object>} Password reset request confirmation
   */
  async requestPasswordReset(email) {
    try {
      // Request password reset with Supabase
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      this._handleAuthError(error, 'Password reset request failed');
      throw error;
    }
  }

  /**
   * Reset password after following reset link
   *
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password reset confirmation
   */
  async resetPassword(newPassword) {
    try {
      // Reset password with Supabase
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      this._handleAuthError(error, 'Password reset failed');
      throw error;
    }
  }

  /**
   * Store user data in localStorage
   * @private
   * @param {Object} userData - User data to store
   */
  _storeUserData(userData) {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  /**
   * Clear stored user data from localStorage
   * @private
   */
  _clearUserData() {
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  /**
   * Get stored user data from localStorage
   * @private
   * @returns {Object|null} Stored user data or null
   */
  _getStoredUser() {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  /**
   * Handle authentication errors with user-friendly messages
   * @private
   * @param {Error} error - Original error
   * @param {string} defaultMessage - Default error message
   */
  _handleAuthError(error, defaultMessage) {
    if (api.isAxiosError && api.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      switch (status) {
        case 401:
          throw new Error('Invalid credentials. Please check your email and password.');
        case 403:
          throw new Error('Account is disabled or verification required.');
        case 409:
          throw new Error('An account with this email already exists.');
        case 422:
          throw new Error('Invalid data: ' + (responseData?.message || 'Please check your input.'));
        case 429:
          throw new Error('Too many attempts. Please try again later.');
        default:
          throw new Error(responseData?.message || defaultMessage);
      }
    } else {
      throw new Error(error.message || defaultMessage);
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();

// Export both class and instance for flexibility
export default authService;
export { AuthService };
