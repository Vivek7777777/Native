import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  default: 'http://0.0.0.0:5000/api',
});

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(async (config) => {
  // Add auth token if exists
  const token = await SecureStore.getItemAsync('authToken'); // Example using expo-secure-store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      // Handle logout
    }
    return Promise.reject(error);
  },
);
