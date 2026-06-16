import { getToday } from '@/utils/date';
import type { TaskPayload } from '@/types/task';

/**
 * Mock 接口逻辑测试（需求第 17 节）。
 * mockData 维护模块级内存状态，故每个用例前 resetModules 重新载入，保证种子数据干净、用例互不影响。
 */

type MockDataModule = typeof import('@/services/mockData');

let mod: MockDataModule;

beforeEach(() => {
  jest.resetModules();
  mod = require('@/services/mockData');
});

const today = getToday();

const payload: TaskPayload = {
  title: '新任务',
  category: 'personal',
  startTime: '09:00',
  date: today,
  status: 'pending',
  isFeatured: false,
};

describe('mockTaskApi', () => {
  it('getTasks 仅返回指定日期的任务', async () => {
    const res = await mod.mockTaskApi.getTasks(today);
    expect(res.success).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data.every((t) => t.date === today)).toBe(true);

    const empty = await mod.mockTaskApi.getTasks('2000-01-01');
    expect(empty.data).toHaveLength(0);
  });

  it('getAllTasks 返回全部种子任务', async () => {
    const res = await mod.mockTaskApi.getAllTasks();
    expect(res.data).toHaveLength(4);
  });

  it('getTaskById 命中返回任务，未命中返回 null', async () => {
    const hit = await mod.mockTaskApi.getTaskById('seed-1');
    expect(hit.data?.id).toBe('seed-1');

    const miss = await mod.mockTaskApi.getTaskById('not-exist');
    expect(miss.data).toBeNull();
  });

  it('createTask 生成 id 与时间戳，并写入列表', async () => {
    const res = await mod.mockTaskApi.createTask(payload);
    expect(res.success).toBe(true);
    expect(res.data.id).toBeTruthy();
    expect(res.data.createdAt).toBeTruthy();
    expect(res.data.updatedAt).toBeTruthy();
    expect(res.data.title).toBe('新任务');

    const all = await mod.mockTaskApi.getAllTasks();
    expect(all.data).toHaveLength(5);
    expect(all.data.some((t) => t.id === res.data.id)).toBe(true);
  });

  it('updateTask 更新字段并刷新 updatedAt，id 保持不变', async () => {
    const res = await mod.mockTaskApi.updateTask('seed-1', {
      ...payload,
      title: '已修改标题',
    });
    expect(res.data.id).toBe('seed-1');
    expect(res.data.title).toBe('已修改标题');

    const fetched = await mod.mockTaskApi.getTaskById('seed-1');
    expect(fetched.data?.title).toBe('已修改标题');
  });

  it('updateTask 对不存在的任务抛出错误', async () => {
    await expect(mod.mockTaskApi.updateTask('not-exist', payload)).rejects.toThrow(
      '任务不存在',
    );
  });

  it('updateTaskStatus 切换状态', async () => {
    const res = await mod.mockTaskApi.updateTaskStatus('seed-1', 'completed');
    expect(res.data.status).toBe('completed');

    const fetched = await mod.mockTaskApi.getTaskById('seed-1');
    expect(fetched.data?.status).toBe('completed');
  });

  it('updateTaskStatus 对不存在的任务抛出错误', async () => {
    await expect(
      mod.mockTaskApi.updateTaskStatus('not-exist', 'completed'),
    ).rejects.toThrow('任务不存在');
  });

  it('deleteTask 从列表移除任务', async () => {
    const res = await mod.mockTaskApi.deleteTask('seed-1');
    expect(res.data.id).toBe('seed-1');

    const all = await mod.mockTaskApi.getAllTasks();
    expect(all.data).toHaveLength(3);
    expect(all.data.some((t) => t.id === 'seed-1')).toBe(false);
  });
});

describe('mockUserApi', () => {
  it('getProfile 依据当前任务实时计算统计', async () => {
    const res = await mod.mockUserApi.getProfile();
    expect(res.success).toBe(true);

    const all = await mod.mockTaskApi.getAllTasks();
    const expectedCompleted = all.data.filter((t) => t.status === 'completed').length;
    const expectedTodayPending = all.data.filter(
      (t) => t.date === today && t.status === 'pending',
    ).length;

    expect(res.data.stats.totalPublished).toBe(all.data.length);
    expect(res.data.stats.totalCompleted).toBe(expectedCompleted);
    expect(res.data.stats.todayPending).toBe(expectedTodayPending);
    expect(res.data.categories.work).toBe(
      all.data.filter((t) => t.category === 'work').length,
    );
  });

  it('完成任务后统计随之更新', async () => {
    const before = await mod.mockUserApi.getProfile();
    await mod.mockTaskApi.updateTaskStatus('seed-1', 'completed');
    const after = await mod.mockUserApi.getProfile();

    expect(after.data.stats.totalCompleted).toBe(before.data.stats.totalCompleted + 1);
    expect(after.data.stats.todayPending).toBe(before.data.stats.todayPending - 1);
  });

  it('logout 返回成功', async () => {
    const res = await mod.mockUserApi.logout();
    expect(res.success).toBe(true);
    expect(res.data).toBeNull();
  });
});
