/** 全局颜色常量（需求第 13 节）。 */
export const colors = {
  primary: '#4080FF',
  primaryLight: '#6BA3FF',
  primaryDark: '#2D6BD4',
  success: '#34D399',
  successLight: '#6EE7B7',
  warning: '#FF6B35',
  warningLight: '#FFA07A',
  danger: '#EF4444',
  background: '#F5F7FA',
  backgroundSecondary: '#EEF1F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#4A5568',
  textTertiary: '#A0AEC0',
  border: '#E8ECF0',
  borderLight: '#F0F4F8',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.4)',
  gradient: {
    primary: ['#4080FF', '#6C5CE7'] as const,
    success: ['#34D399', '#10B981'] as const,
    warning: ['#FF6B35', '#F59E0B'] as const,
    sunset: ['#FF6B35', '#E860E8'] as const,
    ocean: ['#4080FF', '#1AD1CC'] as const,
  },
} as const;

/** Tab 选中 / 未选中态颜色（需求第 5 节）。 */
export const tabColors = {
  active: '#4080FF',
  inactive: '#A0AEC0',
} as const;
