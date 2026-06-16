const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** 把 Date 转为 YYYY-MM-DD。 */
export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 今天的 YYYY-MM-DD。 */
export function getToday(): string {
  return toDateString(new Date());
}

/** 把 YYYY-MM-DD 解析为本地 Date（避免时区偏移）。 */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map((v) => parseInt(v, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

export function getWeekday(dateStr: string): string {
  return WEEKDAYS[parseDate(dateStr).getDay()];
}

/** 例如 “星期五 2026/06/13”。 */
export function formatDateLabel(dateStr: string): string {
  const date = parseDate(dateStr);
  const ymd = `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
  return `${WEEKDAYS[date.getDay()]} ${ymd}`;
}

export type DateTabItem = {
  date: string; // YYYY-MM-DD
  month: string; // MM 月
  weekday: string; // 周五
  day: string; // DD
};

/**
 * 生成日期标签数据：以 baseDate 为中心，前 2 天到后 4 天，共 7 天（需求第 7 节）。
 */
export function buildDateTabs(baseDate: string): DateTabItem[] {
  const base = parseDate(baseDate);
  const items: DateTabItem[] = [];
  for (let offset = -2; offset <= 4; offset += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + offset);
    items.push({
      date: toDateString(d),
      month: `${pad(d.getMonth() + 1)} 月`,
      weekday: WEEKDAYS[d.getDay()].replace('星期', '周'),
      day: pad(d.getDate()),
    });
  }
  return items;
}

export function isToday(dateStr: string): boolean {
  return dateStr === getToday();
}
