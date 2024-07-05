import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost', // Update with your base URL
  baseURL: 'https://better2.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
