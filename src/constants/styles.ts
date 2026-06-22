import { StyleSheet } from 'react-native';

import { colors } from './colors';
import { borderRadius, fontSize, fontWeight, shadows, spacing } from './designTokens';

/**
 * 全局样式
 * 使用设计 token 系统保持一致性
 */
export const globalStyles = StyleSheet.create({
  // 安全区域
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // 居中布局
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },

  // 卡片样式
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    boxShadow: shadows.md,
  },

  // 卡片悬浮样式
  cardElevated: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    boxShadow: shadows.lg,
  },

  // 头部导航
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg - 2,
  },

  // 头部标题
  headerTitle: {
    fontSize: fontSize.massive,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },

  // 标题
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  // 副标题
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // 主要文字
  textPrimary: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },

  // 次要文字
  textSecondary: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // 第三级文字
  textTertiary: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    lineHeight: 16,
  },

  // 主按钮
  primaryButton: {
    height: 52,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.button,
  },

  // 主按钮文字
  primaryButtonText: {
    color: colors.surface,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.3,
  },

  // 次要按钮
  secondaryButton: {
    height: 52,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 次要按钮文字
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },

  // 弹性布局
  flex: {
    flex: 1,
  },

  // 小间距
  gapSmall: {
    gap: spacing.sm,
  },

  // 中间距
  gapMedium: {
    gap: spacing.lg,
  },

  // 水平内边距
  paddingHorizontal: {
    paddingHorizontal: spacing.xl,
  },

  // 内容区域
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },

  // 区块标题
  sectionTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  // 分割线
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  // 错误文字
  errorText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
});

/** 文字样式快捷方式 */
export const textStyles = StyleSheet.create({
  // 页面大标题
  heroTitle: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },

  // 区块标题
  sectionHeader: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },

  // 卡片标题
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },

  // 列表项标题
  listItemTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },

  // 标签文字
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },

  // 小标签
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    color: colors.textTertiary,
  },

  // 按钮文字
  button: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },

  // 链接文字
  link: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
});

/** 间距样式快捷方式 */
export const spacingStyles = StyleSheet.create({
  // 页面边距
  pagePadding: {
    paddingHorizontal: spacing.xl,
  },

  // 卡片内边距
  cardPadding: {
    padding: spacing.lg,
  },

  // 列表项内边距
  listItemPadding: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },

  // 区块间距
  sectionGap: {
    gap: spacing.xl,
  },

  // 卡片间距
  cardGap: {
    gap: spacing.md,
  },

  // 紧凑间距
  tightGap: {
    gap: spacing.sm,
  },
});

export default globalStyles;
