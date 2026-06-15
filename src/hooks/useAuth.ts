import { useState, useEffect, useCallback } from 'react';
import * as storage from '../storage/tokenStorage';
import { mockUser } from '../mock/mockData';
import { UserProfile } from '../types/user';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    (async () => {
      const t = await storage.getToken();
      const u = await storage.getUser();
      setToken(t);
      setUser(u);
    })();
  }, []);

  const mockLogin = useCallback(async () => {
    const t = 'mock-token';
    await storage.setToken(t);
    await storage.setUser(mockUser as any);
    setToken(t);
    setUser(mockUser as any);
  }, []);

  const logout = useCallback(async () => {
    await storage.clearAuthStorage();
    await storage.clearTaskCache();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;

  return { token, user, isAuthenticated, mockLogin, logout } as const;
};
