import type { TaskCategory } from '@/types/task';

/**
 * 应用统一配置入口（需求第 21 节）。
 * 所有全局参数集中在此读取，避免散落在多个文件。
 * 客户端可公开配置统一使用 EXPO_PUBLIC_ 前缀的环境变量。
 */

/** 后端接口基础地址。真机调试请使用电脑局域网 IP，不要用 localhost。 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://192.168.x.x:3000/api';

/** 是否启用 Mock 模式。默认开启，保证应用可独立运行。 */
export const USE_MOCK = (process.env.EXPO_PUBLIC_USE_MOCK ?? 'true') === 'true';

/** 请求超时时间（毫秒）。 */
export const REQUEST_TIMEOUT = 10000;

/** 本地存储 key。 */
export const TOKEN_STORAGE_KEY = '@todo/token';
export const USER_STORAGE_KEY = '@todo/user';
export const TASK_CACHE_STORAGE_KEY = '@todo/tasks';

/** 应用名称。 */
export const APP_NAME = '日程助手';

/** 默认任务分类。 */
export const DEFAULT_TASK_CATEGORY: TaskCategory = 'work';
