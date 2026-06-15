import { useState, useEffect, useCallback } from 'react';
import { getProfile } from '../services/userService';
import * as storage from '../storage/tokenStorage';
import { UserProfile } from '../types/user';

export const useUserProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProfile();
      setUser(res);
      await storage.setUser(res as any);
    } catch (e: any) {
      setError(e.message || '加载用户失败');
      const cached = await storage.getUser();
      setUser(cached);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, loading, error, refresh } as const;
};
