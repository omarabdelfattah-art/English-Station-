import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  progress: [],
  stats: {
    totalLessonsCompleted: 0,
    totalQuizzesCompleted: 0,
    averageScore: 0,
    streakDays: 0,
    speakingPracticeMinutes: 0,
  },
  achievements: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get user progress (calculate from completed lessons)
export const getUserProgress = createAsyncThunk(
  'progress/getUserProgress',
  async (_, thunkAPI) => {
    try {
      const [lessonsResponse, userResponse] = await Promise.all([
        axios.get('http://localhost:5000/lessons'),
        axios.get(`http://localhost:5000/users/${thunkAPI.getState().auth.user.id}`)
      ]);

      const lessons = lessonsResponse.data;
      const user = userResponse.data;

      // Calculate progress based on completed lessons
      const totalLessons = lessons.length;
      const completedLessons = lessons.filter(lesson => lesson.completed).length;

      return {
        totalLessons,
        completedLessons,
        progressPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        currentLevel: user.level,
        streak: user.streak || 0
      };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user stats
export const getUserStats = createAsyncThunk(
  'progress/getUserStats',
  async (_, thunkAPI) => {
    try {
      const [lessonsResponse, quizzesResponse] = await Promise.all([
        axios.get('http://localhost:5000/lessons'),
        axios.get('http://localhost:5000/quizzes')
      ]);

      const lessons = lessonsResponse.data;
      const quizzes = quizzesResponse.data;

      return {
        totalLessonsCompleted: lessons.filter(lesson => lesson.completed).length,
        totalQuizzesCompleted: quizzes.length,
        averageScore: 85, // Mock data - would come from quiz results
        streakDays: 7, // Mock data - would be calculated from activity
        speakingPracticeMinutes: 45 // Mock data
      };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user achievements
export const getUserAchievements = createAsyncThunk(
  'progress/getUserAchievements',
  async (_, thunkAPI) => {
    try {
      // Mock achievements - in a real app, these would come from the API
      const achievements = [
        {
          id: 1,
          title: "First Lesson Completed",
          description: "Complete your first English lesson",
          icon: "🎯",
          unlocked: true,
          unlockedDate: "2024-01-15"
        },
        {
          id: 2,
          title: "Week Streak",
          description: "Complete lessons for 7 days in a row",
          icon: "🔥",
          unlocked: true,
          unlockedDate: "2024-01-20"
        },
        {
          id: 3,
          title: "Quiz Master",
          description: "Score 90% or higher on 5 quizzes",
          icon: "🏆",
          unlocked: false,
          progress: 60
        }
      ];

      return achievements;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update lesson progress
export const updateLessonProgress = createAsyncThunk(
  'progress/updateLessonProgress',
  async (lessonData, thunkAPI) => {
    try {
      const response = await axios.put(`http://localhost:5000/lessons/${lessonData.id}`, {
        ...lessonData,
        completed: true,
        completedDate: new Date().toISOString()
      });

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

// Update quiz progress
export const updateQuizProgress = createAsyncThunk(
  'progress/updateQuizProgress',
  async (quizData, thunkAPI) => {
    try {
      // In a real app, this would create/update a quiz result record
      // For now, we'll just return the data
      return {
        quizId: quizData.quizId,
        score: quizData.score,
        completedDate: new Date().toISOString()
      };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update speaking practice progress
export const updateSpeakingPracticeProgress = createAsyncThunk(
  'progress/updateSpeakingPracticeProgress',
  async (practiceData, thunkAPI) => {
    try {
      // In a real app, this would update speaking practice records
      // For now, we'll just return the data
      return {
        minutes: practiceData.minutes || 5,
        completedDate: new Date().toISOString()
      };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const progressSlice = createSlice({
  name: 'progress',
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
      .addCase(getUserProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.progress = action.payload;
      })
      .addCase(getUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserAchievements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.achievements = action.payload;
      })
      .addCase(getUserAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateLessonProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateLessonProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update progress array
        const existingIndex = state.progress.findIndex(
          (p) => p.lessonId === action.payload.lessonId
        );
        if (existingIndex !== -1) {
          state.progress[existingIndex] = action.payload;
        } else {
          state.progress.push(action.payload);
        }
      })
      .addCase(updateLessonProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateQuizProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateQuizProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update stats
        state.stats.totalQuizzesCompleted += 1;
        state.stats.averageScore = Math.round(
          (state.stats.averageScore + action.payload.score) / 2
        );
      })
      .addCase(updateQuizProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSpeakingPracticeProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSpeakingPracticeProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update stats
        state.stats.speakingPracticeMinutes += action.payload.minutes;
      })
      .addCase(updateSpeakingPracticeProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = progressSlice.actions;
export default progressSlice.reducer;
