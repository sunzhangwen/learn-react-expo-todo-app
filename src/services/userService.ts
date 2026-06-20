import api, { request } from '@/services/api';
import { mockUserApi } from '@/services/mockData';
import { USE_MOCK } from '@/constants/config';
import type { ApiResponse, LoginResponse, RegisterPayload, UserProfile } from '@/types/user';

/**
 * 用户接口（需求第 16 节）。
 */

export async function register(
  payload: RegisterPayload,
): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return mockUserApi.register(payload);
  }
  return request<null>(api.post('/auth/register', payload));
}

export async function login(
  email: string,
  password: string,
): Promise<ApiResponse<LoginResponse>> {
  if (USE_MOCK) {
    return mockUserApi.login();
  }
  return request<LoginResponse>(
    api.post('/auth/login', { email, password }),
  );
}

export async function getProfile(): Promise<ApiResponse<UserProfile>> {
  if (USE_MOCK) {
    return mockUserApi.getProfile();
  }
  return request<UserProfile>(api.get('/user/profile'));
}

export async function logout(): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return mockUserApi.logout();
  }
  return request<null>(api.post('/auth/logout'));
}
