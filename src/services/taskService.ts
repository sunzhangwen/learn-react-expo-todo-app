import api, { request } from '@/services/api';
import { mockTaskApi } from '@/services/mockData';
import { USE_MOCK } from '@/constants/config';
import type { ApiResponse } from '@/types/user';
import type { Task, TaskPayload, TaskStatus } from '@/types/task';

/**
 * 任务接口（需求第 16 节）。
 * USE_MOCK=true 时走集中 Mock 数据，否则调用真实后端。
 */

export async function getTasks(date: string): Promise<ApiResponse<Task[]>> {
  if (USE_MOCK) {
    return mockTaskApi.getTasks(date);
  }
  return request<Task[]>(api.get(`/tasks?date=${encodeURIComponent(date)}`));
}

export async function getAllTasks(): Promise<ApiResponse<Task[]>> {
  if (USE_MOCK) {
    return mockTaskApi.getAllTasks();
  }
  return request<Task[]>(api.get('/tasks'));
}

export async function getTaskById(id: string): Promise<ApiResponse<Task | null>> {
  if (USE_MOCK) {
    return mockTaskApi.getTaskById(id);
  }
  return request<Task | null>(api.get(`/tasks/${id}`));
}

export async function createTask(payload: TaskPayload): Promise<ApiResponse<Task>> {
  if (USE_MOCK) {
    return mockTaskApi.createTask(payload);
  }
  return request<Task>(api.post('/tasks', payload));
}

export async function updateTask(
  id: string,
  payload: TaskPayload,
): Promise<ApiResponse<Task>> {
  if (USE_MOCK) {
    return mockTaskApi.updateTask(id, payload);
  }
  return request<Task>(api.put(`/tasks/${id}`, payload));
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus,
): Promise<ApiResponse<Task>> {
  if (USE_MOCK) {
    return mockTaskApi.updateTaskStatus(id, status);
  }
  return request<Task>(api.patch(`/tasks/${id}/status`, { status }));
}

export async function deleteTask(id: string): Promise<ApiResponse<{ id: string }>> {
  if (USE_MOCK) {
    return mockTaskApi.deleteTask(id);
  }
  return request<{ id: string }>(api.delete(`/tasks/${id}`));
}
