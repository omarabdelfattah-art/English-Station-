import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../context/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg px-6 py-4 flex items-center justify-between mb-6 animate-slide-in glass-effect">
      <Link to="/" className="font-bold text-2xl text-gradient hover:scale-105 transition-transform duration-200">
        🌟 EngL App
      </Link>

      {user ? (
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105">
              📊 Dashboard
            </Link>
            <Link to="/lessons" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105">
              📚 Lessons
            </Link>
            <Link to="/quiz" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105">
              🎯 Quiz
            </Link>
            <Link to="/speaking" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105">
              🗣️ Speaking
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105">
              👤 Profile
            </Link>
            {user.isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105">
                ⚙️ Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, <span className="font-semibold text-gray-900">{user.name}</span>
              </span>
            </div>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105">
            🔐 Login
          </Link>
          <Link to="/register" className="btn-primary">
            ✨ Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;