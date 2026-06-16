import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTasks,
  updateTask,
  updateTaskStatus,
} from '@/services/taskService';
import { getCachedTasks, setCachedTasks } from '@/storage/tokenStorage';
import { timeToMinutes } from '@/utils/validators';
import type { Task, TaskPayload } from '@/types/task';

/**
 * 任务状态 Hook（需求第 19 节）。
 * 传入 selectedDate 时按日期加载（任务列表页）；不传时加载全部任务（首页统计）。
 * 封装增删改与状态切换；内部捕获异常并返回可展示错误。
 */
export function useTasks(selectedDate?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (mode === 'initial') {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);
      try {
        const res = selectedDate ? await getTasks(selectedDate) : await getAllTasks();
        setTasks(res.data);
        // 成功后写入缓存。
        await setCachedTasks(res.data);
      } catch (e) {
        const message = e instanceof Error ? e.message : '加载任务失败';
        setError(message);
        // 失败后读取缓存恢复展示。
        const cached = await getCachedTasks();
        if (cached) {
          setTasks(selectedDate ? cached.filter((t) => t.date === selectedDate) : cached);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedDate],
  );

  useEffect(() => {
    fetchTasks('initial');
  }, [fetchTasks]);

  const refresh = useCallback(() => fetchTasks('refresh'), [fetchTasks]);

  const create = useCallback(
    async (payload: TaskPayload) => {
      const res = await createTask(payload);
      if (!selectedDate || res.data.date === selectedDate) {
        setTasks((prev) => [...prev, res.data]);
      }
      return res.data;
    },
    [selectedDate],
  );

  const update = useCallback(
    async (id: string, payload: TaskPayload) => {
      const res = await updateTask(id, payload);
      setTasks((prev) =>
        // 列表页若任务日期被改到别的天则从当前列表移除；首页（无 selectedDate）始终更新。
        !selectedDate || res.data.date === selectedDate
          ? prev.map((t) => (t.id === id ? res.data : t))
          : prev.filter((t) => t.id !== id),
      );
      return res.data;
    },
    [selectedDate],
  );

  const toggleStatus = useCallback(
    async (id: string) => {
      const target = tasks.find((t) => t.id === id);
      if (!target) {
        return;
      }
      const nextStatus = target.status === 'completed' ? 'pending' : 'completed';
      const res = await updateTaskStatus(id, nextStatus);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    },
    [tasks],
  );

  const remove = useCallback(async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 按 startTime 升序展示（需求第 7 节）。
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
    [tasks],
  );

  return {
    tasks: sortedTasks,
    loading,
    refreshing,
    error,
    refresh,
    create,
    update,
    toggleStatus,
    remove,
  };
}
