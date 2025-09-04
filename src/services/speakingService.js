import api from './api';

const getSpeakingTopics = async () => {
  // For now, return mock topics
  // In a real app, this would fetch from the backend
  return [
    { id: 1, title: 'Daily Life', description: 'Talk about your daily routine' },
    { id: 2, title: 'Travel', description: 'Share your travel experiences' },
    { id: 3, title: 'Food', description: 'Discuss your favorite foods' }
  ];
};

const getSpeakingPrompts = async (topicId) => {
  // For now, return mock prompts
  // In a real app, this would fetch from the backend
  return [
    { id: 1, prompt: 'Describe your typical day.', followUp: 'What do you enjoy most about your daily routine?' },
    { id: 2, prompt: 'Talk about a place you would like to visit.', followUp: 'Why would you like to go there?' }
  ];
};

const submitSpeakingPractice = async (practiceData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // For now, just return a success response
  // In a real app, this would upload the audio file to the backend
  return {
    success: true,
    practiceId: Date.now(),
    message: 'Your practice has been submitted for review.',
    estimatedFeedbackTime: '24 hours'
  };
};

const getSpeakingFeedback = async (practiceId) => {
  // For now, return mock feedback
  // In a real app, this would fetch from the backend
  return {
    id: practiceId,
    score: 85,
    feedback: 'Good pronunciation and fluency. Work on using more varied vocabulary.',
    strengths: ['Pronunciation', 'Fluency'],
    improvements: ['Vocabulary', 'Grammar'],
    timestamp: new Date().toISOString()
  };
};

const getSpeakingHistory = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // For now, return mock history
  // In a real app, this would fetch from the backend
  return [
    { id: 1, topic: 'Daily Life', date: '2023-06-15', score: 80, status: 'Reviewed' },
    { id: 2, topic: 'Travel', date: '2023-06-10', score: 75, status: 'Reviewed' },
    { id: 3, topic: 'Food', date: '2023-06-05', score: null, status: 'Pending' }
  ];
};

const speakingService = {
  getSpeakingTopics,
  getSpeakingPrompts,
  submitSpeakingPractice,
  getSpeakingFeedback,
  getSpeakingHistory,
};

export default speakingService;
