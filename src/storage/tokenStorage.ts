import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, TASK_CACHE_STORAGE_KEY } from '../constants/config';
import { UserProfile } from '../types/user';
import { Task } from '../types/task';

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getUser = async (): Promise<UserProfile | null> => {
  const s = await AsyncStorage.getItem(USER_STORAGE_KEY);
  return s ? JSON.parse(s) : null;
};

export const setUser = async (user: UserProfile) => {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const removeUser = async () => {
  await AsyncStorage.removeItem(USER_STORAGE_KEY);
};

export const clearAuthStorage = async () => {
  await Promise.all([removeToken(), removeUser()]);
};

export const getCachedTasks = async (): Promise<Task[] | null> => {
  const s = await AsyncStorage.getItem(TASK_CACHE_STORAGE_KEY);
  return s ? JSON.parse(s) : null;
};

export const setCachedTasks = async (tasks: Task[]) => {
  await AsyncStorage.setItem(TASK_CACHE_STORAGE_KEY, JSON.stringify(tasks));
};

export const clearTaskCache = async () => {
  await AsyncStorage.removeItem(TASK_CACHE_STORAGE_KEY);
};
