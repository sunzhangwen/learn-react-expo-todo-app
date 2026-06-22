import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

import {
  DEFAULT_THEME,
  DEFAULT_MODE,
  getTabColors,
  getThemeColors,
  ThemeName,
  ThemeMode,
  THEMES,
} from '@/constants/themes';

/** 主题上下文类型 */
interface ThemeContextType {
  /** 当前主题名称 */
  themeName: ThemeName;
  /** 当前主题模式 */
  mode: ThemeMode;
  /** 当前主题的颜色 */
  colors: ReturnType<typeof getThemeColors>;
  /** 当前主题的Tab颜色 */
  tabColors: ReturnType<typeof getTabColors>;
  /** 当前主题的完整配置 */
  theme: (typeof THEMES)[ThemeName];
  /** 是否是暗黑模式 */
  isDark: boolean;
  /** 切换主题 */
  setTheme: (name: ThemeName) => Promise<void>;
  /** 切换模式 */
  setMode: (mode: ThemeMode) => Promise<void>;
  /** 切换亮/暗模式 */
  toggleMode: () => Promise<void>;
  /** 加载状态 */
  loading: boolean;
}

/** 主题上下文 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** AsyncStorage keys */
const THEME_STORAGE_KEY = '@app_theme';
const MODE_STORAGE_KEY = '@app_theme_mode';

/** 主题 Provider */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME);
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [loading, setLoading] = useState(true);

  // 初始化：从存储中加载主题和模式
  useEffect(() => {
    loadThemeAndMode();
  }, []);

  /** 从 AsyncStorage 加载主题和模式 */
  const loadThemeAndMode = async () => {
    try {
      const [storedTheme, storedMode] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(MODE_STORAGE_KEY),
      ]);

      if (storedTheme && storedTheme in THEMES) {
        setThemeName(storedTheme as ThemeName);
      }

      if (storedMode && (storedMode === 'light' || storedMode === 'dark')) {
        setModeState(storedMode as ThemeMode);
      } else {
        // 尝试从系统设置获取
        // 暂时默认使用亮色模式
        setModeState('light');
      }
    } catch (error) {
      console.warn('Failed to load theme settings:', error);
    } finally {
      setLoading(false);
    }
  };

  /** 切换主题并持久化 */
  const setTheme = useCallback(async (name: ThemeName) => {
    try {
      setThemeName(name);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  }, []);

  /** 切换模式并持久化 */
  const setMode = useCallback(async (newMode: ThemeMode) => {
    try {
      setModeState(newMode);
      await AsyncStorage.setItem(MODE_STORAGE_KEY, newMode);
    } catch (error) {
      console.warn('Failed to save mode:', error);
    }
  }, []);

  /** 切换亮/暗模式 */
  const toggleMode = useCallback(async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    await setMode(newMode);
  }, [mode, setMode]);

  const value: ThemeContextType = {
    themeName,
    mode,
    colors: getThemeColors(themeName, mode),
    tabColors: getTabColors(themeName, mode),
    theme: THEMES[themeName],
    isDark: mode === 'dark',
    setTheme,
    setMode,
    toggleMode,
    loading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** 使用主题的 Hook */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/** 主题预览 Hook（用于设置页面预览不同主题） */
export function useThemePreview(themeName: ThemeName, mode: ThemeMode = 'light') {
  return {
    colors: getThemeColors(themeName, mode),
    tabColors: getTabColors(themeName, mode),
    theme: THEMES[themeName],
    isDark: mode === 'dark',
  };
}
