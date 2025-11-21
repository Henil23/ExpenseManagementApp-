// src/services/api.js
import axios from 'axios';

// Create an axios instance with a base URL
const API = axios.create({
  baseURL: 'http://localhost:5001/api', // replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request interceptor (for auth token, if needed)
API.interceptors.request.use(
  (config) => {
    // Example: add auth token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor (for error handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response || error);
    return Promise.reject(error);
  }
);

// Export default so you can import easily
export default API;
