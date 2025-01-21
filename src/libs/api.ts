import axios from 'axios';
import { encryptStorage } from './encryptStorage';
import { useLocaleStore } from '../hooks/localeStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL+"/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = encryptStorage.getItem('token');
  const locals = useLocaleStore.getState().locale
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-version'] = "1"
  config.headers['x-locals'] = locals
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      
    }
    return Promise.reject(error);
  }
);

export default api;