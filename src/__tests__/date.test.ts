import {
  buildDateTabs,
  formatDateLabel,
  getWeekday,
  isToday,
  parseDate,
  toDateString,
} from '@/utils/date';

describe('utils/date', () => {
  it('toDateString 输出 YYYY-MM-DD 并补零', () => {
    expect(toDateString(new Date(2026, 5, 5))).toBe('2026-06-05');
    expect(toDateString(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('parseDate 解析为本地日期，无时区偏移', () => {
    const d = parseDate('2026-06-15');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(15);
  });

  it('getWeekday 返回正确星期（2026-06-15 为星期一）', () => {
    expect(getWeekday('2026-06-15')).toBe('星期一');
  });

  it('formatDateLabel 输出 “星期X YYYY/MM/DD”', () => {
    expect(formatDateLabel('2026-06-15')).toBe('星期一 2026/06/15');
  });

  it('buildDateTabs 生成前 2 天到后 4 天共 7 天', () => {
    const tabs = buildDateTabs('2026-06-15');
    expect(tabs).toHaveLength(7);
    expect(tabs[0].date).toBe('2026-06-13');
    expect(tabs[2].date).toBe('2026-06-15'); // 中心为基准日期
    expect(tabs[6].date).toBe('2026-06-19');
    expect(tabs[2].weekday).toBe('周一');
    expect(tabs[2].day).toBe('15');
    expect(tabs[2].month).toBe('06 月');
  });

  it('isToday 对今天返回 true', () => {
    expect(isToday(toDateString(new Date()))).toBe(true);
    expect(isToday('2000-01-01')).toBe(false);
  });
});
