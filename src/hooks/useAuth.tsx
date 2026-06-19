import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { login as loginApi, logout as logoutApi } from '@/services/userService';
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

type AuthContextValue = {
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  mockLogin: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** 顶层 Provider，包裹在 _layout.tsx 中，全 App 共享同一份认证状态。 */
export function AuthProvider({ children }: { children: ReactNode }) {
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

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginApi(email, password);
    await setToken(res.data.token);
    await setUser(res.data.user);
    setTokenState(res.data.token);
    setUserState(res.data.user);
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

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: Boolean(token),
        login,
        mockLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** 任意组件调用此 hook 获取共享的认证状态。 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
