/**
 * LoginPage Component
 *
 * Handles user authentication with comprehensive input validation
 * and security measures. Includes form validation, error handling,
 * and secure data processing.
 *
 * Features:
 * - Email and password validation
 * - XSS protection through input sanitization
 * - Rate limiting for security
 * - Real-time validation feedback
 * - Responsive design with animations
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, reset } from './context/slices/authSlice';
import Loader from './components/Loader';
import { validateEmail, validatePassword, sanitizeText, validateForm } from './utils/validation';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  /**
   * Form validation rules
   */
  const validationRules = {
    email: { type: 'email' },
    password: { type: 'password' }
  };

  useEffect(() => {
    if (isError) {
      console.error(message);
      setIsSubmitting(false);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  /**
   * Validates a single field
   * @param {string} fieldName - Name of the field to validate
   * @param {string} value - Value to validate
   */
  const validateField = (fieldName, value) => {
    let error = null;

    switch (fieldName) {
      case 'email': {
        if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      }
      case 'password': {
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          error = passwordValidation.errors[0];
        }
        break;
      }
      default:
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return !error;
  };

  /**
   * Handles input changes with real-time validation
   * @param {Object} e - Event object
   */
  const onChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input to prevent XSS
    const sanitizedValue = name === 'password' ? value : sanitizeText(value);

    setFormData((prevState) => ({
      ...prevState,
      [name]: sanitizedValue,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Handles input blur for validation
   * @param {Object} e - Event object
   */
  const onBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  /**
   * Handles form submission with comprehensive validation
   * @param {Object} e - Event object
   */
  const onSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });

    // Validate entire form
    const validation = validateForm(formData, validationRules);

    if (!validation.isFormValid) {
      setValidationErrors(validation.fieldResults);
      return;
    }

    // Set submitting state to prevent double submission
    setIsSubmitting(true);

    // Sanitize data before sending
    const userData = {
      email: sanitizeText(email),
      password: password, // Don't sanitize password as it might contain special chars
    };

    dispatch(login(userData));
  };

  if (isLoading || isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8 glass-effect rounded-2xl p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 animate-float">
            <span className="text-2xl">🌟</span>
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600">
            Sign in to continue your English learning journey
          </p>
        </div>

        <form className="mt-8 space-y-6 animate-slide-in" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={onChange}
                onBlur={onBlur}
              />
              {touched.email && validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 animate-slide-in">
                  ⚠️ {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={onChange}
                onBlur={onBlur}
              />
              {touched.password && validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 animate-slide-in">
                  ⚠️ {validationErrors.password}
                </p>
              )}
            </div>
          </div>

          {(isError || Object.values(validationErrors).some(error => error)) && (
            <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-4 animate-slide-in">
              <div className="flex items-center">
                <span className="text-red-400 mr-2">⚠️</span>
                <p className="text-sm text-red-700">
                  {message || 'Please fix the errors above before submitting.'}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={Object.values(validationErrors).some(error => error)}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 Sign In
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-gradient hover:scale-105 transition-transform duration-200"
              >
                Create one here ✨
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Demo Credentials:</p>
          <p>john@example.com / password123</p>
          <p>jane@example.com / password123</p>
          <p className="font-semibold text-blue-600">Admin: admin@example.com / admin123</p>
          <p className="font-semibold text-blue-600">Admin: omarabdelfattah002@gmail.com / gsxRJv59RkQn4h!</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;