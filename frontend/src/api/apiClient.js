import axios from 'axios';
import { getAuthToken } from '../utils/storage.js';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000'
});

client.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
