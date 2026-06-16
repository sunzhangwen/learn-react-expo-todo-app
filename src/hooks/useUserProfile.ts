import { useCallback, useEffect, useState } from 'react';

import { getProfile } from '@/services/userService';
import { getToken, getUser, setUser } from '@/storage/tokenStorage';
import type { UserProfile } from '@/types/user';

/**
 * 用户资料 Hook（需求第 19 节）。
 * 优先调用接口；失败时读取本地缓存；未登录时返回 null。
 */
export function useUserProfile() {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        // 未登录状态。
        setUserState(null);
        return;
      }
      const res = await getProfile();
      setUserState(res.data);
      await setUser(res.data);
    } catch (e) {
      const message = e instanceof Error ? e.message : '加载用户资料失败';
      setError(message);
      // 接口失败时读取本地缓存。
      const cached = await getUser();
      setUserState(cached);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    user,
    loading,
    error,
    refresh: load,
  };
}
