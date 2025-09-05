/**
 * EngL App - Main Application Component
 *
 * This is the root component of the English Learning Application.
 * It provides the main routing structure and Redux store provider.
 *
 * Features:
 * - React Router for navigation
 * - Redux store provider for state management
 * - Protected routes for authenticated users
 * - Responsive layout with navigation and footer
 *
 * @component
 * @returns {JSX.Element} The main application with routing and layout
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './context/store';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import DashboardPage from './DashboardPage';
import LessonsPage from './LessonsPage';
import QuizPage from './QuizPage';
import ProfilePage from './ProfilePage';
import SpeakingPracticePage from './SpeakingPracticePage';
import AdminPage from './AdminPage';

/**
 * Main Application Component
 *
 * Sets up the application structure with:
 * - Redux Provider for global state management
 * - React Router for navigation
 * - Layout with Navbar, main content, and Footer
 * - Protected routes for authenticated pages
 *
 * @returns {JSX.Element} Complete application structure
 */
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation Bar - Always visible */}
            <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes - Require Authentication */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lessons"
                element={
                  <ProtectedRoute>
                    <LessonsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz"
                element={
                  <ProtectedRoute>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/speaking"
                element={
                  <ProtectedRoute>
                    <SpeakingPracticePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer - Always visible */}
          <Footer />
        </div>
      </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
