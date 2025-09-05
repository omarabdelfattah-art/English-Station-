/**
 * Authentication Slice
 *
 * Redux slice for managing user authentication state and actions.
 * Handles user registration, login, logout, profile updates, and onboarding flow.
 *
 * Features:
 * - Async thunks for API calls
 * - Local storage persistence
 * - Error handling and loading states
 * - User onboarding and placement test tracking
 *
 * @module authSlice
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * Retrieves user data from localStorage on app initialization
 * @constant {Object|null} user - Parsed user object from localStorage or null
 */
const user = JSON.parse(localStorage.getItem('user'));

/**
 * Initial state for the authentication slice
 * @typedef {Object} AuthState
 * @property {Object|null} user - Current authenticated user object
 * @property {boolean} isLoading - Loading state for async operations
 * @property {boolean} isSuccess - Success state for completed operations
 * @property {boolean} isError - Error state for failed operations
 * @property {string} message - Error or success message
 * @property {boolean} isOnboarded - Whether user has completed onboarding
 * @property {boolean} placementTestCompleted - Whether user has completed placement test
 */
const initialState = {
  user: user ? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  isOnboarded: user ? user.isOnboarded : false,
  placementTestCompleted: user ? user.placementTestCompleted : false,
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      // Use authService to register with Supabase
      const { authService } = await import('../../services/authService');
      const response = await authService.register(userData);

      if (response.user) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          name: userData.name,
          level: 'A1',
          progress: 0,
          streak: 0,
          isOnboarded: true,
          placementTestCompleted: true,
          token: response.session?.access_token,
          refreshToken: response.session?.refresh_token
        };

        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    // Use authService to login with Supabase
    const { authService } = await import('../../services/authService');
    const response = await authService.login(userData);

    if (response.user) {
      const userData = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.user_metadata?.name || response.user.email,
        token: response.session?.access_token,
        refreshToken: response.session?.refresh_token
      };

      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    // Use authService to logout from Supabase
    const { authService } = await import('../../services/authService');
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('user');
  }
});

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const userId = thunkAPI.getState().auth.user.id;
      const response = await axios.put(`/api/users/${userId}`, userData);

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Complete onboarding
export const completeOnboarding = createAsyncThunk(
  'auth/completeOnboarding',
  async (_, thunkAPI) => {
    try {
      const userId = thunkAPI.getState().auth.user.id;
      const response = await axios.put(`/api/users/${userId}`, {
        isOnboarded: true
      });

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Complete placement test
export const completePlacementTest = createAsyncThunk(
  'auth/completePlacementTest',
  async (testData, thunkAPI) => {
    try {
      const userId = thunkAPI.getState().auth.user.id;
      const response = await axios.put(`/api/users/${userId}`, {
        placementTestCompleted: true,
        level: testData.level || 'A1'
      });

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isOnboarded = action.payload.isOnboarded;
        state.placementTestCompleted = action.payload.placementTestCompleted;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isOnboarded = false;
        state.placementTestCompleted = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(completeOnboarding.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isOnboarded = true;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(completePlacementTest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(completePlacementTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.placementTestCompleted = true;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(completePlacementTest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
