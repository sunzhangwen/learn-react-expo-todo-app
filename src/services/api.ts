import axios, { AxiosError, type AxiosInstance } from 'axios';

import { API_BASE_URL, REQUEST_TIMEOUT } from '@/constants/config';
import { getToken, clearAuthStorage } from '@/storage/tokenStorage';
import type { ApiResponse } from '@/types/user';

/**
 * axios 实例与拦截器（需求第 16 节）。
 * 页面组件不得直接调用该实例，必须通过 services 层。
 */
// eslint-disable-next-line import/no-named-as-default-member
const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：附加 token。
instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// 响应拦截器：统一返回响应体；处理 401 与错误信息。
instance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      await clearAuthStorage();
    }
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? '请求超时，请稍后重试' : '') ||
      error.message ||
      '网络异常，请稍后重试';
    return Promise.reject(new Error(message));
  },
);

/**
 * 真实请求统一入口。响应拦截器已返回 ApiResponse<T>，此处直接透传。
 */
export async function request<T>(promise: Promise<unknown>): Promise<ApiResponse<T>> {
  return promise as Promise<ApiResponse<T>>;
}

export default instance;
