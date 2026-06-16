/** 全局颜色常量（需求第 13 节）。 */
export const colors = {
  primary: '#4080FF', // 主色、按钮、Tab 选中
  success: '#34D399', // 完成状态
  warning: '#FF6B35', // 提醒色
  background: '#F5F7FA', // 页面背景
  surface: '#FFFFFF', // 卡片背景
  textPrimary: '#333333', // 主文字
  textSecondary: '#666666', // 次文字
  textTertiary: '#999999', // 辅助文字
  border: '#F0F0F0', // 边框与分割线
} as const;

/** Tab 选中 / 未选中态颜色（需求第 5 节）。 */
export const tabColors = {
  active: '#4080FF',
  inactive: '#999999',
} as const;
