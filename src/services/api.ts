import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT, TOKEN_STORAGE_KEY } from '../constants/config';
import * as tokenStorage from '../storage/tokenStorage';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await tokenStorage.getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      await tokenStorage.clearAuthStorage();
    }
    return Promise.reject(err?.response?.data || err.message || 'Network Error');
  }
);

export default api;
