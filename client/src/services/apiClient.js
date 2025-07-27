import axios from 'axios';

const apiClient = axios.create({
  // Use the environment variable for the base URL
  baseURL: process.env.REACT_APP_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;