import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLanguage,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setError,
  clearError,
  setSuccessMessage,
  clearSuccessMessage,
} from '../context/slices/uiSlice';

export const useUI = () => {
  const dispatch = useDispatch();
  const {
    sidebarOpen,
    theme,
    language,
    notifications,
    isLoading,
    error,
    successMessage,
  } = useSelector((state) => state.ui);

  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const handleSetSidebarOpen = useCallback(
    (open) => {
      dispatch(setSidebarOpen(open));
    },
    [dispatch]
  );

  const handleSetTheme = useCallback(
    (newTheme) => {
      dispatch(setTheme(newTheme));
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
    },
    [dispatch]
  );

  const handleSetLanguage = useCallback(
    (newLanguage) => {
      dispatch(setLanguage(newLanguage));
      // Save to localStorage
      localStorage.setItem('language', newLanguage);
    },
    [dispatch]
  );

  const handleAddNotification = useCallback(
    (notification) => {
      dispatch(addNotification(notification));
    },
    [dispatch]
  );

  const handleRemoveNotification = useCallback(
    (id) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  const handleClearNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const handleSetLoading = useCallback(
    (loading) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  const handleSetError = useCallback(
    (errorMessage) => {
      dispatch(setError(errorMessage));
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSetSuccessMessage = useCallback(
    (message) => {
      dispatch(setSuccessMessage(message));
    },
    [dispatch]
  );

  const handleClearSuccessMessage = useCallback(() => {
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  // Initialize theme and language from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      dispatch(setLanguage(savedLanguage));
    }
  }, [dispatch]);

  return {
    sidebarOpen,
    theme,
    language,
    notifications,
    isLoading,
    error,
    successMessage,
    toggleSidebar: handleToggleSidebar,
    setSidebarOpen: handleSetSidebarOpen,
    setTheme: handleSetTheme,
    setLanguage: handleSetLanguage,
    addNotification: handleAddNotification,
    removeNotification: handleRemoveNotification,
    clearNotifications: handleClearNotifications,
    setLoading: handleSetLoading,
    setError: handleSetError,
    clearError: handleClearError,
    setSuccessMessage: handleSetSuccessMessage,
    clearSuccessMessage: handleClearSuccessMessage,
  };
};
