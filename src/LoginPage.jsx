import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, reset } from './context/slices/authSlice';
import Loader from './components/Loader';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                placeholder="Enter your email"
                value={email}
                onChange={onChange}
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                placeholder="Enter your password"
                value={password}
                onChange={onChange}
              />
            </div>
          </div>

          {isError && (
            <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-4 animate-slide-in">
              <div className="flex items-center">
                <span className="text-red-400 mr-2">⚠️</span>
                <p className="text-sm text-red-700">{message}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary py-3 text-lg font-semibold"
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;