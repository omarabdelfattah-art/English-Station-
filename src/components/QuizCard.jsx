import React from 'react';

const QuizCard = ({ title, questionsCount, onStart }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-4 flex items-center justify-between card-hover animate-slide-in glass-effect group">
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 flex items-center">
        <span className="mr-2">📝</span>
        {questionsCount} questions
      </p>
    </div>
    <button
      className="btn-primary animate-float"
      onClick={onStart}
    >
      🚀 Start Quiz
    </button>
  </div>
);

export default QuizCard;