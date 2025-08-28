import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLessons } from './context/slices/lessonsSlice';
import QuizCard from './components/QuizCard';
import QuizTaking from './components/QuizTaking';
import Loader from './components/Loader';
import axios from 'axios';

const QuizPage = () => {
  const dispatch = useDispatch();
  const { lessons, isLoading: lessonsLoading } = useSelector((state) => state.lessons);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    if (lessons.length === 0) {
      dispatch(getLessons());
    }
    fetchQuizzes();
  }, [dispatch, lessons.length]);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLessonTitle = (lessonId) => {
    const lesson = lessons.find(l => l.id === lessonId);
    return lesson ? lesson.title : 'Unknown Lesson';
  };

  const handleStartQuiz = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
      // Mock quiz questions - in a real app, these would come from the API
      const mockQuestions = [
        {
          id: 1,
          question: "What is the correct way to say 'hello' in English?",
          options: ["Hallo", "Hello", "Halo", "Helo"],
          correctAnswer: "Hello"
        },
        {
          id: 2,
          question: "Which sentence is grammatically correct?",
          options: [
            "I goed to the store",
            "I went to the store",
            "I go to the store",
            "I going to the store"
          ],
          correctAnswer: "I went to the store"
        },
        {
          id: 3,
          question: "What does 'apple' mean?",
          options: ["Fruit", "Color", "Animal", "Car"],
          correctAnswer: "Fruit"
        }
      ];

      setActiveQuiz({
        ...quiz,
        title: `Quiz for ${getLessonTitle(quiz.lessonId)}`,
        questions: mockQuestions
      });
    }
  };

  const handleQuizComplete = (score) => {
    setQuizResults(prev => [...prev, { quizId: activeQuiz.id, score, date: new Date() }]);
    setActiveQuiz(null);
  };

  const handleBackToQuizzes = () => {
    setActiveQuiz(null);
  };

  // Show quiz taking interface if active quiz is selected
  if (activeQuiz) {
    return (
      <QuizTaking
        quiz={activeQuiz}
        questions={activeQuiz.questions}
        onComplete={handleQuizComplete}
        onBack={handleBackToQuizzes}
      />
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quizzes</h1>
      <p className="text-gray-600 mb-6">Test your knowledge with these interactive quizzes</p>

      {loading || lessonsLoading ? (
        <Loader />
      ) : quizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No quizzes available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              title={`Quiz for ${getLessonTitle(quiz.lessonId)}`}
              questionsCount={3} // Mock question count
              onStart={() => handleStartQuiz(quiz.id)}
            />
          ))}
        </div>
      )}

      {/* Quiz Results Section */}
      {quizResults.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Recent Quiz Results</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-3">
              {quizResults.slice(-5).reverse().map((result, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="font-medium">Quiz {result.quizId}</p>
                    <p className="text-sm text-gray-600">{new Date(result.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${result.score >= 70 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {result.score}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.score >= 70 ? 'Excellent' : result.score >= 50 ? 'Good' : 'Needs Improvement'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;