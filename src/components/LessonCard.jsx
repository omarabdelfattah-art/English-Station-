import React from 'react';

const LessonCard = ({ title, level, completed }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-4 flex items-center justify-between card-hover animate-fade-in glass-effect transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">Level: <span className="font-medium text-blue-600">{level}</span></p>
    </div>
    <span
      className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
        completed
          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 shadow-md animate-pulse-glow'
          : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 shadow-md hover:shadow-lg'
      }`}
    >
      {completed ? '✓ Completed' : '📚 In Progress'}
    </span>
  </div>
);

export default LessonCard;