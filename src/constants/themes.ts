/** 主题类型定义 */
export type ThemeName = 'fresh' | 'warm' | 'elegant';

/** 主题模式 */
export type ThemeMode = 'light' | 'dark';

/** 主题颜色配置 */
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  shadow: string;
  shadowDark: string;
  overlay: string;
  gradient: {
    primary: readonly [string, string];
    success: readonly [string, string];
    warning: readonly [string, string];
    sunset: readonly [string, string];
    ocean: readonly [string, string];
  };
}

/** 主题配置 */
export interface Theme {
  name: ThemeName;
  label: string;
  description: string;
  colors: ThemeColors;
  darkColors: ThemeColors;
  tabColors: {
    active: string;
    inactive: string;
  };
  darkTabColors: {
    active: string;
    inactive: string;
  };
}

/** 清新自然风格 - 绿色系 */
const freshTheme: Theme = {
  name: 'fresh',
  label: '清新自然',
  description: '清新、自然、舒适的绿色主题',
  colors: {
    primary: '#2ECC71',
    primaryLight: '#58D68D',
    primaryDark: '#27AE60',
    success: '#27AE60',
    successLight: '#82E0AA',
    warning: '#F39C12',
    warningLight: '#F8C471',
    danger: '#E74C3C',
    background: '#F8F9FA',
    backgroundSecondary: '#E9ECEF',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#2C3E50',
    textSecondary: '#7F8C8D',
    textTertiary: '#BDC3C7',
    border: '#DEE2E6',
    borderLight: '#F1F3F5',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowDark: 'rgba(0, 0, 0, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    gradient: {
      primary: ['#2ECC71', '#27AE60'] as const,
      success: ['#2ECC71', '#1ABC9C'] as const,
      warning: ['#F39C12', '#E67E22'] as const,
      sunset: ['#E74C3C', '#C0392B'] as const,
      ocean: ['#3498DB', '#2980B9'] as const,
    },
  },
  darkColors: {
    primary: '#2ECC71',
    primaryLight: '#58D68D',
    primaryDark: '#27AE60',
    success: '#27AE60',
    successLight: '#82E0AA',
    warning: '#F39C12',
    warningLight: '#F8C471',
    danger: '#E74C3C',
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    surface: '#1E1E1E',
    surfaceElevated: '#2D2D2D',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#6C6C6C',
    border: '#333333',
    borderLight: '#2A2A2A',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    gradient: {
      primary: ['#2ECC71', '#27AE60'] as const,
      success: ['#2ECC71', '#1ABC9C'] as const,
      warning: ['#F39C12', '#E67E22'] as const,
      sunset: ['#E74C3C', '#C0392B'] as const,
      ocean: ['#3498DB', '#2980B9'] as const,
    },
  },
  tabColors: {
    active: '#2ECC71',
    inactive: '#BDC3C7',
  },
  darkTabColors: {
    active: '#2ECC71',
    inactive: '#6C6C6C',
  },
};

/** 温暖活力风格 - 橙色系 */
const warmTheme: Theme = {
  name: 'warm',
  label: '温暖活力',
  description: '温暖、活力、热情的橙色主题',
  colors: {
    primary: '#FF6B35',
    primaryLight: '#FF8C5A',
    primaryDark: '#E55A2B',
    success: '#4CAF50',
    successLight: '#81C784',
    warning: '#FFC107',
    warningLight: '#FFD54F',
    danger: '#F44336',
    background: '#FFF8F0',
    backgroundSecondary: '#FFE8D6',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#3E2723',
    textSecondary: '#795548',
    textTertiary: '#BCAAA4',
    border: '#FFCCBC',
    borderLight: '#FFE0B2',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowDark: 'rgba(0, 0, 0, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    gradient: {
      primary: ['#FF6B35', '#FF8C5A'] as const,
      success: ['#4CAF50', '#66BB6A'] as const,
      warning: ['#FFC107', '#FFB300'] as const,
      sunset: ['#FF6B35', '#E91E63'] as const,
      ocean: ['#2196F3', '#1976D2'] as const,
    },
  },
  darkColors: {
    primary: '#FF8C5A',
    primaryLight: '#FFB088',
    primaryDark: '#FF6B35',
    success: '#66BB6A',
    successLight: '#81C784',
    warning: '#FFD54F',
    warningLight: '#FFE082',
    danger: '#EF5350',
    background: '#1A1410',
    backgroundSecondary: '#2D2420',
    surface: '#2D2420',
    surfaceElevated: '#3D3430',
    textPrimary: '#FFFFFF',
    textSecondary: '#CCBBAA',
    textTertiary: '#887766',
    border: '#443322',
    borderLight: '#3D3430',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    gradient: {
      primary: ['#FF8C5A', '#FF6B35'] as const,
      success: ['#66BB6A', '#4CAF50'] as const,
      warning: ['#FFD54F', '#FFC107'] as const,
      sunset: ['#FF8C5A', '#E91E63'] as const,
      ocean: ['#42A5F5', '#2196F3'] as const,
    },
  },
  tabColors: {
    active: '#FF6B35',
    inactive: '#BCAAA4',
  },
  darkTabColors: {
    active: '#FF8C5A',
    inactive: '#887766',
  },
};

/** 优雅专业风格 - 靛蓝色系 */
const elegantTheme: Theme = {
  name: 'elegant',
  label: '优雅专业',
  description: '专业、稳重、优雅的蓝色主题',
  colors: {
    primary: '#3F51B5',
    primaryLight: '#5C6BC0',
    primaryDark: '#303F9F',
    success: '#009688',
    successLight: '#4DB6AC',
    warning: '#FF9800',
    warningLight: '#FFB74D',
    danger: '#F44336',
    background: '#FAFAFA',
    backgroundSecondary: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#212121',
    textSecondary: '#616161',
    textTertiary: '#9E9E9E',
    border: '#E0E0E0',
    borderLight: '#EEEEEE',
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowDark: 'rgba(0, 0, 0, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    gradient: {
      primary: ['#3F51B5', '#5C6BC0'] as const,
      success: ['#009688', '#4DB6AC'] as const,
      warning: ['#FF9800', '#FFB74D'] as const,
      sunset: ['#E91E63', '#C2185B'] as const,
      ocean: ['#00BCD4', '#00ACC1'] as const,
    },
  },
  darkColors: {
    primary: '#5C6BC0',
    primaryLight: '#7986CB',
    primaryDark: '#3F51B5',
    success: '#4DB6AC',
    successLight: '#80CBC4',
    warning: '#FFB74D',
    warningLight: '#FFCC80',
    danger: '#EF5350',
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    surface: '#1E1E1E',
    surfaceElevated: '#2D2D2D',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#6C6C6C',
    border: '#333333',
    borderLight: '#2A2A2A',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    gradient: {
      primary: ['#5C6BC0', '#7986CB'] as const,
      success: ['#4DB6AC', '#80CBC4'] as const,
      warning: ['#FFB74D', '#FFCC80'] as const,
      sunset: ['#EC407A', '#E91E63'] as const,
      ocean: ['#26C6DA', '#00BCD4'] as const,
    },
  },
  tabColors: {
    active: '#3F51B5',
    inactive: '#9E9E9E',
  },
  darkTabColors: {
    active: '#5C6BC0',
    inactive: '#6C6C6C',
  },
};

/** 所有可用主题 */
export const THEMES: Record<ThemeName, Theme> = {
  fresh: freshTheme,
  warm: warmTheme,
  elegant: elegantTheme,
};

/** 主题列表（用于设置页面展示） */
export const THEME_LIST: Theme[] = [freshTheme, warmTheme, elegantTheme];

/** 默认主题 */
export const DEFAULT_THEME: ThemeName = 'fresh';

/** 默认模式 */
export const DEFAULT_MODE: ThemeMode = 'light';

/** 获取主题颜色的辅助函数 */
export const getThemeColors = (themeName: ThemeName, mode: ThemeMode = 'light'): ThemeColors => {
  const theme = THEMES[themeName];
  return mode === 'dark' ? theme.darkColors : theme.colors;
};

/** 获取Tab颜色的辅助函数 */
export const getTabColors = (themeName: ThemeName, mode: ThemeMode = 'light') => {
  const theme = THEMES[themeName];
  return mode === 'dark' ? theme.darkTabColors : theme.tabColors;
};
