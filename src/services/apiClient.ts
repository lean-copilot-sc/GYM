import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'https://api.example.com',
  timeout: 10000
});

apiClient.interceptors.request.use((config) => {
  // Attach auth headers when integrating with real backend
  return config;
});

export default apiClient;
