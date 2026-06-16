import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  TASK_CACHE_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '@/constants/config';
import type { Task } from '@/types/task';
import type { UserProfile } from '@/types/user';

/**
 * 本地存储封装（需求第 18 节）。
 * 页面与 Hook 只能通过此模块读写 AsyncStorage，禁止直接调用 AsyncStorage。
 */

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_STORAGE_KEY);
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function getUser(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function setUser(user: UserProfile): Promise<void> {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export async function removeUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_STORAGE_KEY);
}

/** 清除认证相关缓存（token + 用户）。 */
export async function clearAuthStorage(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
}

export async function getCachedTasks(): Promise<Task[] | null> {
  const raw = await AsyncStorage.getItem(TASK_CACHE_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return null;
  }
}

export async function setCachedTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASK_CACHE_STORAGE_KEY, JSON.stringify(tasks));
}

export async function clearTaskCache(): Promise<void> {
  await AsyncStorage.removeItem(TASK_CACHE_STORAGE_KEY);
}
