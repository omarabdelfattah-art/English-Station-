import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLessons,
  getLessonById,
  getCategories,
  completeLesson,
} from '../context/slices/lessonsSlice';

export const useLessons = () => {
  const dispatch = useDispatch();
  const {
    lessons,
    currentLesson,
    categories,
    isLoading,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.lessons);

  const fetchLessons = useCallback(() => {
    dispatch(getLessons());
  }, [dispatch]);

  const fetchLessonById = useCallback(
    (id) => {
      dispatch(getLessonById(id));
    },
    [dispatch]
  );

  const fetchCategories = useCallback(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleCompleteLesson = useCallback(
    (lessonId) => {
      dispatch(completeLesson(lessonId));
    },
    [dispatch]
  );

  return {
    lessons,
    currentLesson,
    categories,
    isLoading,
    isSuccess,
    isError,
    message,
    fetchLessons,
    fetchLessonById,
    fetchCategories,
    completeLesson: handleCompleteLesson,
  };
};
