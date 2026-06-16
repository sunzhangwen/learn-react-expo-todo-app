import { getToday } from '@/utils/date';
import type { Task, TaskPayload, TaskStatus } from '@/types/task';
import type { ApiResponse, UserProfile } from '@/types/user';

/**
 * 集中维护的 Mock 数据与 Mock 接口（需求第 17 节）。
 * Mock 数据不写在页面组件中；返回结构与真实接口一致。
 */

const today = getToday();

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(): string {
  return `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/** 模拟 300~500ms 网络延迟。 */
function delay<T>(value: T): Promise<T> {
  const ms = 300 + Math.floor(Math.random() * 200);
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function ok<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return { success: true, data, message };
}

// 可变的内存任务表，支持增删改查与状态切换。
let mockTasks: Task[] = [
  {
    id: 'seed-1',
    title: '公司年终复盘会议',
    category: 'work',
    startTime: '08:00',
    endTime: '10:00',
    date: today,
    status: 'pending',
    isFeatured: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'seed-2',
    title: '部门年终总结分享会',
    category: 'work',
    startTime: '10:30',
    endTime: '12:00',
    date: today,
    status: 'pending',
    isFeatured: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'seed-3',
    title: '广州插画分享会',
    category: 'activity',
    startTime: '14:00',
    endTime: '16:00',
    location: '西西弗书店',
    date: today,
    status: 'pending',
    isFeatured: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'seed-4',
    title: '下班配钥匙',
    category: 'personal',
    startTime: '18:30',
    location: '下沙市场',
    date: today,
    status: 'pending',
    isFeatured: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

export const mockTaskApi = {
  async getTasks(date: string): Promise<ApiResponse<Task[]>> {
    return delay(ok(mockTasks.filter((t) => t.date === date)));
  },

  async getAllTasks(): Promise<ApiResponse<Task[]>> {
    return delay(ok([...mockTasks]));
  },

  async getTaskById(id: string): Promise<ApiResponse<Task | null>> {
    return delay(ok(mockTasks.find((t) => t.id === id) ?? null));
  },

  async createTask(payload: TaskPayload): Promise<ApiResponse<Task>> {
    const task: Task = {
      ...payload,
      id: makeId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    mockTasks = [...mockTasks, task];
    return delay(ok(task, '创建成功'));
  },

  async updateTask(id: string, payload: TaskPayload): Promise<ApiResponse<Task>> {
    let updated: Task | null = null;
    mockTasks = mockTasks.map((t) => {
      if (t.id !== id) {
        return t;
      }
      updated = { ...t, ...payload, id, updatedAt: nowIso() };
      return updated;
    });
    if (!updated) {
      throw new Error('任务不存在');
    }
    return delay(ok(updated, '更新成功'));
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<ApiResponse<Task>> {
    let updated: Task | null = null;
    mockTasks = mockTasks.map((t) => {
      if (t.id !== id) {
        return t;
      }
      updated = { ...t, status, updatedAt: nowIso() };
      return updated;
    });
    if (!updated) {
      throw new Error('任务不存在');
    }
    return delay(ok(updated, '状态已更新'));
  },

  async deleteTask(id: string): Promise<ApiResponse<{ id: string }>> {
    mockTasks = mockTasks.filter((t) => t.id !== id);
    return delay(ok({ id }, '删除成功'));
  },
};

const mockUser: UserProfile = {
  id: 'u_10086',
  name: '小张同学',
  email: 'zhangsan@example.com',
  avatar: undefined,
  stats: {
    todayPending: 0,
    totalPublished: 0,
    totalCompleted: 0,
  },
  categories: {
    work: 0,
    personal: 0,
    activity: 0,
  },
};

export const mockUserApi = {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    // 根据当前任务实时计算统计，保证“我的”页面数据与任务一致。
    const todayPending = mockTasks.filter(
      (t) => t.date === today && t.status === 'pending',
    ).length;
    const totalPublished = mockTasks.length;
    const totalCompleted = mockTasks.filter((t) => t.status === 'completed').length;
    const categories = {
      work: mockTasks.filter((t) => t.category === 'work').length,
      personal: mockTasks.filter((t) => t.category === 'personal').length,
      activity: mockTasks.filter((t) => t.category === 'activity').length,
    };
    return delay(
      ok({
        ...mockUser,
        stats: { todayPending, totalPublished, totalCompleted },
        categories,
      }),
    );
  },

  async logout(): Promise<ApiResponse<null>> {
    return delay(ok(null, '已退出登录'));
  },
};

export const MOCK_TOKEN = 'mock-token-1234567890';
export const MOCK_USER: UserProfile = mockUser;
