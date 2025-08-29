import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

export const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000
});

// attach token automatically (for non-hook usage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// handy hooks for components if needed
export const useApi = () => {
  const { token } = useAuth();
  const instance = axios.create({ baseURL: `${API_URL}/api`, timeout: 15000 });
  instance.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return instance;
};
