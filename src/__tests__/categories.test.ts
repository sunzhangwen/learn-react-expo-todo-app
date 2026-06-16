import { CATEGORIES, getCategoryMeta } from '@/constants/categories';

describe('constants/categories', () => {
  it('固定包含 work / personal / activity 三类', () => {
    expect(CATEGORIES.map((c) => c.key)).toEqual(['work', 'personal', 'activity']);
  });

  it('getCategoryMeta 返回正确显示名与颜色', () => {
    expect(getCategoryMeta('work')).toMatchObject({ label: '工作', color: '#4080FF' });
    expect(getCategoryMeta('personal')).toMatchObject({ label: '个人', color: '#1AD1CC' });
    expect(getCategoryMeta('activity')).toMatchObject({ label: '活动', color: '#E860E8' });
  });
});
