import api from './api';

const getQuizByLessonId = async (lessonId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get(`/quizzes/${lessonId}`, config);
  return response.data;
};

const submitQuiz = async (quizData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.post('/quizzes/submit', quizData, config);
  return response.data;
};

const getQuizResults = async (quizId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get(`/quizzes/results/${quizId}`, config);
  return response.data;
};

const quizService = {
  getQuizByLessonId,
  submitQuiz,
  getQuizResults,
};

export default quizService;
