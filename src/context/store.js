import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import lessonsReducer from './slices/lessonsSlice';
import progressReducer from './slices/progressSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonsReducer,
    progress: progressReducer,
    ui: uiReducer,
  },
});
