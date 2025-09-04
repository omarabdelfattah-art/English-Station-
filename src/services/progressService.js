import api from './api';

const getUserProgress = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await api.get(`/progress/user/${user.id}`);
  return response;
};

const getUserStats = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const progress = await api.get(`/progress/user/${user.id}`);
  
  // Calculate stats from progress data
  const completedLessons = progress.filter(p => p.completed).length;
  const totalLessons = progress.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  return {
    completedLessons,
    totalLessons,
    progressPercentage
  };
};

const getUserAchievements = async () => {
  // For now, return mock achievements
  // In a real app, this would fetch from the backend
  return [
    { id: 1, title: 'First Steps', description: 'Complete your first lesson', achieved: true },
    { id: 2, title: 'Quick Learner', description: 'Complete 5 lessons in one day', achieved: false },
    { id: 3, title: 'Quiz Master', description: 'Score 100% on 3 quizzes', achieved: false }
  ];
};

const updateLessonProgress = async (progressData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await api.post('/progress', {
    userId: user.id,
    lessonId: progressData.lessonId,
    completed: progressData.completed,
    progress: progressData.progress
  });
  return response;
};

const updateQuizProgress = async (progressData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Update user progress based on quiz results
  await api.post('/progress', {
    userId: user.id,
    lessonId: progressData.lessonId,
    completed: progressData.completed,
    progress: progressData.progress
  });
  
  // In a real app, this would also save quiz results
  return { success: true };
};

const updateSpeakingPracticeProgress = async (progressData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await api.post('/progress', {
    userId: user.id,
    lessonId: progressData.lessonId,
    completed: progressData.completed,
    progress: progressData.progress
  });
  return response;
};

const getLeaderboard = async () => {
  // For now, return mock leaderboard
  // In a real app, this would fetch from the backend
  return [
    { id: 1, username: 'Ahmed', score: 1200, rank: 1 },
    { id: 2, username: 'Fatima', score: 980, rank: 2 },
    { id: 3, username: 'Omar', score: 750, rank: 3 }
  ];
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
