import { useCallback, useEffect, useState } from 'react';

import { logout as logoutApi } from '@/services/userService';
import { MOCK_TOKEN, MOCK_USER } from '@/services/mockData';
import {
  clearAuthStorage,
  clearTaskCache,
  getToken,
  getUser,
  setToken,
  setUser,
} from '@/storage/tokenStorage';
import type { UserProfile } from '@/types/user';

/**
 * 认证状态 Hook（需求第 19 节）。
 * 仅负责状态与行为，不渲染 UI；内部捕获异常。
 */
export function useAuth() {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [t, u] = await Promise.all([getToken(), getUser()]);
      setTokenState(t);
      setUserState(u);
    } catch {
      setTokenState(null);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const mockLogin = useCallback(async () => {
    await setToken(MOCK_TOKEN);
    await setUser(MOCK_USER);
    setTokenState(MOCK_TOKEN);
    setUserState(MOCK_USER);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // 即使后端登出失败，也要清理本地状态。
    }
    await clearAuthStorage();
    await clearTaskCache();
    setTokenState(null);
    setUserState(null);
  }, []);

  return {
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    mockLogin,
    logout,
  };
}
