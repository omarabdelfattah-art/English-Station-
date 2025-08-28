import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserProgress,
  getUserStats,
  getUserAchievements,
  updateLessonProgress,
  updateQuizProgress,
  updateSpeakingPracticeProgress,
} from '../context/slices/progressSlice';
import progressService from '../services/progressService';

export const useProgress = () => {
  const dispatch = useDispatch();
  const {
    progress,
    stats,
    achievements,
    isLoading,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.progress);

  const fetchUserProgress = useCallback(() => {
    dispatch(getUserProgress());
  }, [dispatch]);

  const fetchUserStats = useCallback(() => {
    dispatch(getUserStats());
  }, [dispatch]);

  const fetchUserAchievements = useCallback(() => {
    dispatch(getUserAchievements());
  }, [dispatch]);

  const handleUpdateLessonProgress = useCallback(
    (progressData) => {
      dispatch(updateLessonProgress(progressData));
    },
    [dispatch]
  );

  const handleUpdateQuizProgress = useCallback(
    (progressData) => {
      dispatch(updateQuizProgress(progressData));
    },
    [dispatch]
  );

  const handleUpdateSpeakingPracticeProgress = useCallback(
    (progressData) => {
      dispatch(updateSpeakingPracticeProgress(progressData));
    },
    [dispatch]
  );

  const getLeaderboard = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      return await progressService.getLeaderboard(user.token);
    }
    return [];
  }, []);

  return {
    progress,
    stats,
    achievements,
    isLoading,
    isSuccess,
    isError,
    message,
    fetchUserProgress,
    fetchUserStats,
    fetchUserAchievements,
    updateLessonProgress: handleUpdateLessonProgress,
    updateQuizProgress: handleUpdateQuizProgress,
    updateSpeakingPracticeProgress: handleUpdateSpeakingPracticeProgress,
    getLeaderboard,
  };
};
