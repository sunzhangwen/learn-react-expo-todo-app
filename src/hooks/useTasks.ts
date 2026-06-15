import { useState, useCallback, useEffect } from 'react';
import { Task } from '../types/task';
import * as taskService from '../services/taskService';
import * as storage from '../storage/tokenStorage';

export const useTasks = (selectedDate?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskService.getTasks(selectedDate);
      setTasks(res.sort((a, b) => a.startTime.localeCompare(b.startTime)));
      await storage.setCachedTasks(res);
    } catch (e: any) {
      setError(e.message || '加载失败');
      const cached = await storage.getCachedTasks();
      if (cached) setTasks(cached.filter((t) => !selectedDate || t.date === selectedDate));
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await taskService.getTasks(selectedDate);
      setTasks(res.sort((a, b) => a.startTime.localeCompare(b.startTime)));
      await storage.setCachedTasks(res);
    } catch (e: any) {
      setError(e.message || '刷新失败');
    } finally {
      setRefreshing(false);
    }
  }, [selectedDate]);

  const create = useCallback(async (payload: Partial<Task>) => {
    const created = await taskService.createTask(payload);
    setTasks((s) => [...s, created].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    return created;
  }, []);

  const update = useCallback(async (id: string, payload: Partial<Task>) => {
    const updated = await taskService.updateTask(id, payload);
    if (updated) {
      setTasks((s) => s.map((t) => (t.id === id ? updated : t)));
    }
    return updated;
  }, []);

  const toggleStatus = useCallback(async (id: string) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) throw new Error('Not found');
    const newStatus = t.status === 'pending' ? 'completed' : 'pending';
    const updated = await taskService.updateTaskStatus(id, newStatus as any);
    setTasks((s) => s.map((x) => (x.id === id ? updated : x)));
    return updated;
  }, [tasks]);

  const remove = useCallback(async (id: string) => {
    await taskService.deleteTask(id);
    setTasks((s) => s.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { tasks, loading, refreshing, error, refresh, create, update, toggleStatus, remove } as const;
};
