import Constants from 'expo-constants';

const manifestExtra = (Constants.expoConfig || Constants.manifest || {}).extra || {};
const apiBaseUrl = manifestExtra.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
const useMock = manifestExtra.EXPO_PUBLIC_USE_MOCK === 'false' ? false : true;

export const API_BASE_URL = apiBaseUrl;
export const USE_MOCK = useMock;
export const REQUEST_TIMEOUT = 10000;
export const TOKEN_STORAGE_KEY = 'TODO_APP_TOKEN';
export const USER_STORAGE_KEY = 'TODO_APP_USER';
export const TASK_CACHE_STORAGE_KEY = 'TODO_APP_TASKS_CACHE';
export const APP_NAME = 'Todo App';
export const DEFAULT_TASK_CATEGORY = 'work';

