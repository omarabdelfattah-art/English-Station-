import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLessons } from './context/slices/lessonsSlice';
import LessonCard from './components/LessonCard';
import Loader from './components/Loader';

const LessonsPage = () => {
  const dispatch = useDispatch();
  const { lessons, isLoading, isError, message } = useSelector((state) => state.lessons);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title'); // title, level, completed

  useEffect(() => {
    if (lessons.length === 0) {
      dispatch(getLessons());
    }
  }, [dispatch, lessons.length]);

  const filteredAndSortedLessons = React.useMemo(() => {
    let filtered = lessons;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply level filter
    if (filter !== 'all') {
      filtered = filtered.filter(lesson => lesson.level === filter);
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return a.level.localeCompare(b.level);
        case 'completed':
          return (b.completed ? 1 : 0) - (a.completed ? 1 : 0);
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });
  }, [lessons, filter, searchTerm, sortBy]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lessons</h1>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Level Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="A1">A1 - Beginner</option>
            <option value="A2">A2 - Elementary</option>
            <option value="B1">B1 - Intermediate</option>
            <option value="B2">B2 - Upper Intermediate</option>
          </select>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title">Sort by Title</option>
            <option value="level">Sort by Level</option>
            <option value="completed">Sort by Status</option>
          </select>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || filter !== 'all') && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Search: &ldquo;{searchTerm}&rdquo;
              </span>
            )}
            {filter !== 'all' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Level: {filter}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="text-blue-500 hover:text-blue-700 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Lessons Grid */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isError ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p className="font-semibold">Error loading lessons</p>
              <p>{message}</p>
              <button
                onClick={() => dispatch(getLessons())}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          ) : filteredAndSortedLessons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No lessons found for the selected level.</p>
              <button
                onClick={() => setFilter('all')}
                className="mt-2 text-blue-500 hover:text-blue-600 underline"
              >
                Show all lessons
              </button>
            </div>
          ) : (
            filteredAndSortedLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                title={lesson.title}
                level={lesson.level}
                completed={lesson.completed}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LessonsPage;