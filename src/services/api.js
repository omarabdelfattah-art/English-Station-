import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    // If token expired and we haven't tried to refresh it yet
    if (
      error.response.status === 401 &&
      originalRequest.url === `${API_URL}/auth/refresh-token`
    ) {
      // Redirect to login if refresh token fails
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== `${API_URL}/auth/login`
    ) {
      originalRequest._retry = true;
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken: user.refreshToken,
          });
          if (res.data.token) {
            const updatedUser = {
              ...user,
              token: res.data.token,
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            api.defaults.headers.common['Authorization'] =
              'Bearer ' + res.data.token;
            originalRequest.headers.Authorization = 'Bearer ' + res.data.token;
            return api(originalRequest);
          }
        } catch (err) {
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
