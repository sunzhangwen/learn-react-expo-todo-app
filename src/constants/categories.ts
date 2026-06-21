import type { Ionicons } from '@expo/vector-icons';
import type { TaskCategory } from '@/types/task';

export type CategoryMeta = {
  key: TaskCategory;
  label: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
};

/** 任务分类元数据（需求第 13 节）。 */
export const CATEGORIES: CategoryMeta[] = [
  { key: 'work', label: '工作', color: '#4080FF', icon: 'briefcase-outline' },
  { key: 'personal', label: '个人', color: '#1AD1CC', icon: 'person-outline' },
  { key: 'activity', label: '活动', color: '#E860E8', icon: 'football-outline' },
];

const CATEGORY_MAP: Record<TaskCategory, CategoryMeta> = CATEGORIES.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<TaskCategory, CategoryMeta>,
);

export function getCategoryMeta(key: TaskCategory): CategoryMeta {
  return CATEGORY_MAP[key] ?? CATEGORIES[0];
}
