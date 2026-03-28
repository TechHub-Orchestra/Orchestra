import axios from 'axios';
import { tokenStorage } from '@/utils/tokenStorage';

const axiosInstance = axios.create({
  baseURL: 'https://orchestra-y8vf.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      // In Axios 1.x+, config.headers is an object that can be modified directly
      // or using the set() method if it's an AxiosHeaders instance.
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        // Fallback for older axios versions or if headers is a plain object
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Normalizing response: return response.data.data or raw data if not wrapped
    return response.data?.data ?? response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clearToken();
      // Don't hard-redirect — let the dashboard layout guard handle it
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
