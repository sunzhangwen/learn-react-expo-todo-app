import type { TaskCategory } from '@/types/task';

export type CategoryMeta = {
  key: TaskCategory;
  label: string;
  color: string;
};

/** 任务分类元数据（需求第 13 节）。 */
export const CATEGORIES: CategoryMeta[] = [
  { key: 'work', label: '工作', color: '#4080FF' },
  { key: 'personal', label: '个人', color: '#1AD1CC' },
  { key: 'activity', label: '活动', color: '#E860E8' },
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
