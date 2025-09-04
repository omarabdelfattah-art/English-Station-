import api from './api';

const getQuizByLessonId = async (lessonId) => {
  const response = await api.get(`/quizzes?lessonId=${lessonId}`);
  return response[0] || null;
};

const submitQuiz = async (quizData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await api.post(`/quizzes/${quizData.quizId}/submit`, {
    userId: user.id,
    answers: quizData.answers
  });
  return response;
};

const getQuizResults = async (quizId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await api.get(`/quiz/results/${user.id}`);
  return response.filter(result => result.quizId === parseInt(quizId));
};

const quizService = {
  getQuizByLessonId,
  submitQuiz,
  getQuizResults,
};

export default quizService;
