/**
 * LessonsPage Component
 *
 * Advanced lesson management page with comprehensive filtering,
 * search, sorting, and pagination capabilities.
 *
 * Features:
 * - Advanced multi-criteria filtering (level, completion status, difficulty)
 * - Real-time search functionality
 * - Multiple sorting options
 * - Pagination with customizable page sizes
 * - Filter state management and persistence
 * - Responsive design for all devices
 *
 * @component
 * @returns {JSX.Element} Lessons page with advanced filtering and pagination
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLessons } from './context/slices/lessonsSlice';
import LessonCard from './components/LessonCard';
import Loader from './components/Loader';
import { sanitizeText } from './utils/validation';

const LessonsPage = () => {
  const dispatch = useDispatch();
  const { lessons, isLoading, isError, message } = useSelector((state) => state.lessons);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [completionFilter, setCompletionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // UI States
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  /**
   * Updates active filters display
   */
  useEffect(() => {
    const filters = [];
    if (searchTerm) filters.push(`Search: "${searchTerm}"`);
    if (levelFilter !== 'all') filters.push(`Level: ${levelFilter}`);
    if (completionFilter !== 'all') filters.push(`Status: ${completionFilter === 'completed' ? 'Done' : 'Pending'}`);
    setActiveFilters(filters);
  }, [searchTerm, levelFilter, completionFilter]);

  /**
   * Resets pagination when filters change
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [levelFilter, completionFilter, searchTerm]);

  /**
   * Handles search input with sanitization
   */
  const handleSearchChange = (e) => {
    const sanitized = sanitizeText(e.target.value);
    setSearchTerm(sanitized);
  };

  /**
   * Clears all filters
   */
  const clearAllFilters = () => {
    setSearchTerm('');
    setLevelFilter('all');
    setCompletionFilter('all');
    setCurrentPage(1);
  };

  /**
   * Filters and sorts lessons with advanced criteria
   */
  const getFilteredAndSortedLessons = () => {
    let filtered = [...lessons];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchLower) ||
        lesson.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(lesson => lesson.level === levelFilter);
    }

    // Apply completion filter
    if (completionFilter !== 'all') {
      const isCompleted = completionFilter === 'completed';
      filtered = filtered.filter(lesson => lesson.completed === isCompleted);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'level':
          comparison = a.level.localeCompare(b.level);
          break;
        case 'completed':
          comparison = (b.completed ? 1 : 0) - (a.completed ? 1 : 0);
          break;
        case 'title':
        default:
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  };

  const filteredAndSortedLessons = React.useMemo(() => {
    if (lessons.length === 0) return [];
    return getFilteredAndSortedLessons();
  }, [lessons, levelFilter, completionFilter, searchTerm, sortBy, sortOrder]);

  // Pagination calculations
  const totalItems = filteredAndSortedLessons.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLessons = filteredAndSortedLessons.slice(startIndex, endIndex);

  /**
   * Pagination handlers
   */
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const generatePageNumbers = () => {
    const pages = [];
    const showPages = 5; // Show 5 page numbers
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  useEffect(() => {
    if (lessons.length === 0) {
      dispatch(getLessons());
    }
  }, [dispatch, lessons.length]);

  /**
   * Shows/hides advanced filtering options
   */
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 English Lessons</h1>
        <p className="text-gray-600">Master English with our comprehensive lesson collection</p>
      </div>

      {/* Advanced Search and Filters */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">

        {/* Basic Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search lessons by title or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">

          {/* Level Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 English Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="A1">🌱 A1 - Beginner</option>
              <option value="A2">🌿 A2 - Elementary</option>
              <option value="B1">🌳 B1 - Intermediate</option>
              <option value="B2">🌲 B2 - Upper Intermediate</option>
            </select>
          </div>

          {/* Completion Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ✅ Completion Status
            </label>
            <select
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">✅ Completed</option>
              <option value="pending">⏳ Pending</option>
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔄 Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="title">📝 Title</option>
                <option value="level">📊 Level</option>
                <option value="completed">✅ Status</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ↕️ Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">⬆️ Ascending</option>
                <option value="desc">⬇️ Descending</option>
              </select>
            </div>
          </div>

          {/* Items Per Page */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📄 Items Per Page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="6">6 items</option>
              <option value="9">9 items</option>
              <option value="12">12 items</option>
              <option value="18">18 items</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Active Filters Tags */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {filter}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {(searchTerm || levelFilter !== 'all' || completionFilter !== 'all') && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                🗑️ Clear All
              </button>
            )}

            <button
              onClick={toggleAdvancedFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ⚙️ {showAdvancedFilters ? 'Hide' : 'Show'} Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-gray-600">
          <span className="font-medium text-gray-900">{totalItems}</span> lessons found
          {totalPages > 1 && (
            <span className="text-sm">
              {' '}• Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {generatePageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Lessons Content */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Error State */}
          {isError ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Lessons</h3>
                <p className="text-red-600 mb-4">{message}</p>
                <button
                  onClick={() => dispatch(getLessons())}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  🔄 Try Again
                </button>
              </div>
            </div>
          ) : totalItems === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Lessons Found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search criteria or clear all filters to see available lessons.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🔍 View All Lessons
                </button>
              </div>
            </div>
          ) : (
            /* Lessons Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  title={lesson.title}
                  level={lesson.level}
                  completed={lesson.completed}
                />
              ))}
            </div>
          )}

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <span className="px-3 py-2 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LessonsPage;