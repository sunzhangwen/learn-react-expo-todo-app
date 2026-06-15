export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

export const getDayOfWeek = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return days[date.getDay()];
};

export const getDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const dow = getDayOfWeek(dateStr);
  return `星期${dow} ${year}/${month}/${day}`;
};

export const getNext7Days = (fromDate?: string): string[] => {
  const start = fromDate ? new Date(fromDate + 'T00:00:00') : new Date();
  const dates: string[] = [];
  for (let i = -2; i <= 4; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
};

export const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr === today;
};
