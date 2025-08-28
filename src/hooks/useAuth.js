import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  register,
  login,
  logout,
  updateProfile,
  completeOnboarding,
  completePlacementTest,
} from '../context/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const handleRegister = useCallback(
    async (userData) => {
      await dispatch(register(userData));
    },
    [dispatch]
  );

  const handleLogin = useCallback(
    async (userData) => {
      await dispatch(login(userData));
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  const handleUpdateProfile = useCallback(
    async (userData) => {
      await dispatch(updateProfile(userData));
    },
    [dispatch]
  );

  const handleCompleteOnboarding = useCallback(async () => {
    await dispatch(completeOnboarding());
  }, [dispatch]);

  const handleCompletePlacementTest = useCallback(
    async (testData) => {
      await dispatch(completePlacementTest(testData));
    },
    [dispatch]
  );

  return {
    user,
    isLoading,
    isSuccess,
    isError,
    message,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    completeOnboarding: handleCompleteOnboarding,
    completePlacementTest: handleCompletePlacementTest,
  };
};
