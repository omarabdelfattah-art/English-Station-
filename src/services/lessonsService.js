import api from './api';

const getLessons = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get('/lessons', config);
  return response.data;
};

const getLessonById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get(`/lessons/${id}`, config);
  return response.data;
};

const getCategories = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get('/lessons/categories', config);
  return response.data;
};

const completeLesson = async (lessonId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.post(`/lessons/${lessonId}/complete`, {}, config);
  return response.data;
};

const lessonsService = {
  getLessons,
  getLessonById,
  getCategories,
  completeLesson,
};

export default lessonsService;
