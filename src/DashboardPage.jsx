import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getLessons } from './context/slices/lessonsSlice';
import ProgressBar from './components/ProgressBar';
import Loader from './components/Loader';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { lessons, isLoading } = useSelector((state) => state.lessons);

  // Mock progress data for chart
  const chartData = [
    { name: 'Week 1', progress: 15, lessons: 2 },
    { name: 'Week 2', progress: 32, lessons: 4 },
    { name: 'Week 3', progress: 48, lessons: 6 },
    { name: 'Week 4', progress: 65, lessons: 8 },
  ];

  useEffect(() => {
    if (lessons.length === 0) {
      dispatch(getLessons());
    }
  }, [dispatch, lessons.length]);

  // Calculate stats from Redux state
  const stats = useMemo(() => {
    const completedLessons = lessons.filter(lesson => lesson.completed).length;
    return {
      totalLessons: lessons.length,
      completedLessons,
      totalQuizzes: 0, // Will be updated when quizzes are in Redux
      averageScore: 85, // Mock data
      currentStreak: 7 // Mock data
    };
  }, [lessons]);

  const progressPercentage = stats.totalLessons > 0
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
    : 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Lessons Completed</span>
                <span>{stats.completedLessons}/{stats.totalLessons}</span>
              </div>
              <ProgressBar progress={progressPercentage} />
              <p className="text-sm text-gray-500 mt-2">{progressPercentage}% Complete</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Quizzes:</span>
                <span className="font-semibold">{stats.totalQuizzes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Score:</span>
                <span className="font-semibold">{stats.averageScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Streak:</span>
                <span className="font-semibold">{stats.currentStreak} days</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-green-600 font-medium">✓</span> Completed &ldquo;Basic Greetings&rdquo; lesson
              </div>
              <div className="text-sm">
                <span className="text-blue-600 font-medium">🎯</span> Scored 90% on Quiz 1
              </div>
              <div className="text-sm">
                <span className="text-purple-600 font-medium">🔥</span> 7-day learning streak!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Progress %"
            />
            <Line
              type="monotone"
              dataKey="lessons"
              stroke="#10b981"
              strokeWidth={2}
              name="Lessons Completed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;