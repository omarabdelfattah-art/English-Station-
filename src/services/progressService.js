import api from './api';

const getUserProgress = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get('/progress', config);
  return response.data;
};

const getUserStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get('/progress/stats', config);
  return response.data;
};

const getUserAchievements = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get('/progress/achievements', config);
  return response.data;
};

const updateLessonProgress = async (progressData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.post('/progress/lesson', progressData, config);
  return response.data;
};

const updateQuizProgress = async (progressData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.post('/progress/quiz', progressData, config);
  return response.data;
};

const updateSpeakingPracticeProgress = async (progressData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.post(
    '/progress/speaking-practice',
    progressData,
    config
  );
  return response.data;
};

const getLeaderboard = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get('/progress/leaderboard', config);
  return response.data;
};

const progressService = {
  getUserProgress,
  getUserStats,
  getUserAchievements,
  updateLessonProgress,
  updateQuizProgress,
  updateSpeakingPracticeProgress,
  getLeaderboard,
};

export default progressService;
