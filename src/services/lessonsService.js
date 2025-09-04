import api from './api';

const getLessons = async () => {
  const response = await api.get('/api/lessons');
  return response;
};

const getLessonById = async (id) => {
  const response = await api.get(`/api/lessons/${id}`);
  return response;
};

const getCategories = async () => {
  const response = await api.get('/api/lessons/categories');
  return response;
};

const completeLesson = async (lessonId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await api.post('/api/progress', {
    userId: user.id,
    lessonId,
    completed: true,
    progress: 100
  });
  return response;
};

const lessonsService = {
  getLessons,
  getLessonById,
  getCategories,
  completeLesson,
};

export default lessonsService;
