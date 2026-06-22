/**
 * 设计 Token 系统
 * 统一管理间距、圆角、阴影、字体等设计规范
 */

/** 间距系统 (4pt base) */
export const spacing = {
  /** 2px */
  xxs: 2,
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  xxl: 24,
  /** 32px */
  xxxl: 32,
  /** 40px */
  huge: 40,
  /** 48px */
  massive: 48,
} as const;

/** 圆角系统 */
export const borderRadius = {
  /** 4px */
  xs: 4,
  /** 6px */
  sm: 6,
  /** 8px */
  md: 8,
  /** 10px */
  lg: 10,
  /** 12px */
  xl: 12,
  /** 14px */
  xxl: 14,
  /** 16px */
  xxxl: 16,
  /** 20px */
  huge: 20,
  /** 24px */
  massive: 24,
  /** 完全圆形 */
  full: 9999,
} as const;

/** 阴影系统 */
export const shadows = {
  /** 微弱阴影 */
  none: '0px 0px 0px rgba(0, 0, 0, 0)',
  /** 轻微阴影 */
  sm: '0px 1px 3px rgba(0, 0, 0, 0.06)',
  /** 小阴影 */
  md: '0px 2px 8px rgba(0, 0, 0, 0.06)',
  /** 中等阴影 */
  lg: '0px 4px 12px rgba(0, 0, 0, 0.08)',
  /** 大阴影 */
  xl: '0px 8px 24px rgba(0, 0, 0, 0.12)',
  /** 超大阴影 */
  xxl: '0px 12px 32px rgba(0, 0, 0, 0.16)',
  /** 悬浮阴影 */
  float: '0px 8px 20px rgba(0, 0, 0, 0.15)',
  /** 按钮阴影 */
  button: '0px 4px 12px rgba(64, 128, 255, 0.3)',
} as const;

/** 字体大小系统 */
export const fontSize = {
  /** 10px - 极小 */
  xxs: 10,
  /** 11px - 小标签 */
  xs: 11,
  /** 12px - 辅助文字 */
  sm: 12,
  /** 13px - 次要文字 */
  md: 13,
  /** 14px - 正文小字 */
  base: 14,
  /** 15px - 正文 */
  lg: 15,
  /** 16px - 标题小字 */
  xl: 16,
  /** 17px - 标题 */
  xxl: 17,
  /** 18px - 大标题 */
  xxxl: 18,
  /** 20px - 页面标题 */
  huge: 20,
  /** 24px - 大标题 */
  massive: 24,
  /** 28px - 超大标题 */
  giant: 28,
  /** 32px - 巨大标题 */
  hero: 32,
} as const;

/** 字体粗细系统 */
export const fontWeight = {
  /** 400 - 常规 */
  regular: '400' as const,
  /** 500 - 中等 */
  medium: '500' as const,
  /** 600 - 半粗 */
  semibold: '600' as const,
  /** 700 - 粗体 */
  bold: '700' as const,
  /** 800 - 特粗 */
  extrabold: '800' as const,
};

/** 行高系统 */
export const lineHeight = {
  /** 紧凑 */
  tight: 1.25,
  /** 正常 */
  normal: 1.5,
  /** 宽松 */
  relaxed: 1.75,
  /** 松散 */
  loose: 2,
} as const;

/** 动画时长 */
export const animation = {
  /** 快速 - 微交互 */
  fast: 150,
  /** 正常 - 普通过渡 */
  normal: 250,
  /** 慢速 - 页面过渡 */
  slow: 350,
  /** 很慢 - 复杂动画 */
  verySlow: 500,
} as const;

/** 不透明度 */
export const opacity = {
  /** 完全透明 */
  transparent: 0,
  /** 极低 */
  ultraLight: 0.1,
  /** 很低 */
  veryLight: 0.2,
  /** 低 */
  light: 0.3,
  /** 中低 */
  mediumLight: 0.5,
  /** 正常 */
  normal: 0.7,
  /** 高 */
  high: 0.85,
  /** 很高 */
  veryHigh: 0.95,
  /** 完全不透明 */
  opaque: 1,
} as const;

/** Z-index 层级 */
export const zIndex = {
  /** 基础层 */
  base: 0,
  /** 下拉菜单 */
  dropdown: 10,
  /** 固定元素 */
  sticky: 20,
  /** 悬浮按钮 */
  fab: 30,
  /** 模态框背景 */
  modalBackdrop: 40,
  /** 模态框 */
  modal: 50,
  /** 弹窗 */
  popover: 60,
  /** 工具提示 */
  tooltip: 70,
  /** 顶部导航 */
  topBar: 80,
  /** Toast通知 */
  toast: 90,
  /** 最高层 */
  max: 100,
} as const;

/** 间距使用示例 - 语义化命名 */
export const semanticSpacing = {
  /** 内联元素间距 */
  inline: spacing.xs,
  /** 小组件内间距 */
  componentSm: spacing.sm,
  /** 中组件内间距 */
  componentMd: spacing.md,
  /** 大组件内间距 */
  componentLg: spacing.lg,
  /** 卡片内间距 */
  card: spacing.lg,
  /** 页面边距 */
  page: spacing.xl,
  /** 列表项间距 */
  listItem: spacing.md,
  /** 卡片间距 */
  cardGap: spacing.md,
  /** 区块间距 */
  section: spacing.xl,
} as const;

/** 导出所有 token */
export const designTokens = {
  spacing,
  borderRadius,
  shadows,
  fontSize,
  fontWeight,
  lineHeight,
  animation,
  opacity,
  zIndex,
  semanticSpacing,
} as const;

export type DesignTokens = typeof designTokens;
