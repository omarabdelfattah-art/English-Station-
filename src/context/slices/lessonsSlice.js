import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lessonsService from '../../services/lessonsService';

const initialState = {
  lessons: [],
  currentLesson: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  categories: [],
  userLevel: 'beginner',
};

// Get all lessons
export const getLessons = createAsyncThunk(
  'lessons/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await lessonsService.getLessons(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get lesson by ID
export const getLessonById = createAsyncThunk(
  'lessons/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await lessonsService.getLessonById(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get lesson categories
export const getCategories = createAsyncThunk(
  'lessons/getCategories',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await lessonsService.getCategories(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark lesson as completed
export const completeLesson = createAsyncThunk(
  'lessons/completeLesson',
  async (lessonId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await lessonsService.completeLesson(lessonId, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLessons.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLessons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lessons = action.payload;
      })
      .addCase(getLessons.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getLessonById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLessonById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentLesson = action.payload;
      })
      .addCase(getLessonById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(completeLesson.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(completeLesson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the lesson in the lessons array
        const index = state.lessons.findIndex(
          (lesson) => lesson.id === action.payload.id
        );
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
        // If current lesson is the one being completed, update it
        if (state.currentLesson && state.currentLesson.id === action.payload.id) {
          state.currentLesson = action.payload;
        }
      })
      .addCase(completeLesson.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setCurrentLesson } = lessonsSlice.actions;
export default lessonsSlice.reducer;
