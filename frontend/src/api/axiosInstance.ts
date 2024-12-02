import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach token to header
  }
  return config;
});

axiosInstance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
      console.log('error', error);
      toast.error(error?.response?.data?.message || 'An error occurred');
      if (error.response?.status === 401) {
        toast.info('Session expired. Please log in again.');
        localStorage.removeItem('authToken'); // Clear token
        window.location.href = '/login'; // Redirect to login
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;