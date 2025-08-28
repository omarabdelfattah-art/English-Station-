import api from './api';

const getSpeakingTopics = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get('/speaking/topics', config);
  return response.data;
};

const getSpeakingPrompts = async (topicId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get(`/speaking/prompts/${topicId}`, config);
  return response.data;
};

const submitSpeakingPractice = async (practiceData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await api.post('/speaking/submit', practiceData, config);
  return response.data;
};

const getSpeakingFeedback = async (practiceId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get(`/speaking/feedback/${practiceId}`, config);
  return response.data;
};

const getSpeakingHistory = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get('/speaking/history', config);
  return response.data;
};

const speakingService = {
  getSpeakingTopics,
  getSpeakingPrompts,
  submitSpeakingPractice,
  getSpeakingFeedback,
  getSpeakingHistory,
};

export default speakingService;
