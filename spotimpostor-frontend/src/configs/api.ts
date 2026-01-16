import axios from 'axios';

// 1. Detecta la URL: 
// En Vercel usará la variable que configuraste (https://spotimpostor-backend.onrender.com)
// En local, como no hay variable, usará '/api' (activando tu proxy de vite.config.ts)
const BASE = import.meta.env.VITE_API_URL || '';

const API_BASE_URL = `${BASE}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_spot');

    // Define invalid token string values that might be erroneously stored.
    const invalidTokenValues = ['undefined', 'null', '[object Object]'];

    // A token is valid if it exists and is not one of the invalid string values.
    const isValidToken = token && !invalidTokenValues.includes(token);

    if (isValidToken) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If no valid token, the request is sent without the Authorization header,
    // allowing the backend to treat it as a public/guest request.
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clean up local storage
      localStorage.removeItem('token_spot');
      // Redirect to login page
      // Using window.location.href to force a full page reload, which can help in resetting the app's state
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Return the error to be handled by the component that made the request
    return Promise.reject(error);
  }
);

export default api;