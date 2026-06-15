import { Task } from '../types/task';
import { USE_MOCK } from '../constants/config';
import { mockTasks } from '../mock/mockData';

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export const getTasks = async (date?: string): Promise<Task[]> => {
  if (USE_MOCK) {
    await delay(300 + Math.random() * 200);
    return mockTasks.filter((t) => !date || t.date === date);
  }
  // Real API integration placeholder
  throw new Error('Not implemented');
};

export const getAllTasks = async (): Promise<Task[]> => {
  if (USE_MOCK) {
    await delay(300 + Math.random() * 200);
    return mockTasks;
  }
  throw new Error('Not implemented');
};

export const getTaskById = async (id: string): Promise<Task | null> => {
  if (USE_MOCK) {
    await delay(300 + Math.random() * 200);
    return mockTasks.find((t) => t.id === id) || null;
  }
  throw new Error('Not implemented');
};

export const createTask = async (payload: Partial<Task>): Promise<Task> => {
  if (USE_MOCK) {
    await delay(300 + Math.random() * 200);
    const newTask: Task = {
      id: String(Date.now()),
      title: payload.title || 'Untitled',
      category: (payload as any).category || 'work',
      startTime: payload.startTime || '00:00',
      endTime: payload.endTime,
      location: payload.location,
      note: payload.note,
      date: payload.date || new Date().toISOString().slice(0, 10),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTasks.push(newTask);
    return newTask;
  }
  throw new Error('Not implemented');
};

export const updateTask = async (id: string, payload: Partial<Task>): Promise<Task | null> => {
  if (USE_MOCK) {
    await delay(300 + Math.random() * 200);
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    mockTasks[idx] = { ...mockTasks[idx], ...payload, updatedAt: new Date().toISOString() };
    return mockTasks[idx];
  }
  throw new Error('Not implemented');
};

export const updateTaskStatus = async (id: string, status: 'pending' | 'completed') => {
  if (USE_MOCK) {
    await delay(200 + Math.random() * 200);
    const t = mockTasks.find((x) => x.id === id);
    if (!t) throw new Error('Not found');
    t.status = status;
    t.updatedAt = new Date().toISOString();
    return t;
  }
  throw new Error('Not implemented');
};

export const deleteTask = async (id: string) => {
  if (USE_MOCK) {
    await delay(200 + Math.random() * 200);
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Not found');
    mockTasks.splice(idx, 1);
    return true;
  }
  throw new Error('Not implemented');
};
