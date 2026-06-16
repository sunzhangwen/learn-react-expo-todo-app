import {
  hasErrors,
  isValidTime,
  timeToMinutes,
  validateTaskForm,
  type TaskFormValues,
} from '@/utils/validators';

const base: TaskFormValues = {
  title: '写周报',
  startTime: '09:00',
  endTime: '',
  location: '',
  note: '',
};

describe('utils/validators', () => {
  it('isValidTime 仅接受合法 HH:mm', () => {
    expect(isValidTime('08:00')).toBe(true);
    expect(isValidTime('23:59')).toBe(true);
    expect(isValidTime('8:00')).toBe(false);
    expect(isValidTime('24:00')).toBe(false);
    expect(isValidTime('12:60')).toBe(false);
    expect(isValidTime('abc')).toBe(false);
  });

  it('timeToMinutes 计算分钟数，非法返回 NaN', () => {
    expect(timeToMinutes('01:30')).toBe(90);
    expect(timeToMinutes('00:00')).toBe(0);
    expect(Number.isNaN(timeToMinutes('bad'))).toBe(true);
  });

  it('合法表单无错误', () => {
    expect(hasErrors(validateTaskForm(base))).toBe(false);
  });

  it('标题为空（trim 后）报错', () => {
    const errors = validateTaskForm({ ...base, title: '   ' });
    expect(errors.title).toBeDefined();
  });

  it('标题超过 50 字报错', () => {
    const errors = validateTaskForm({ ...base, title: 'a'.repeat(51) });
    expect(errors.title).toBeDefined();
  });

  it('开始时间为空报错', () => {
    const errors = validateTaskForm({ ...base, startTime: '' });
    expect(errors.startTime).toBeDefined();
  });

  it('开始时间格式非法报错', () => {
    const errors = validateTaskForm({ ...base, startTime: '9点' });
    expect(errors.startTime).toBeDefined();
  });

  it('结束时间早于开始时间报错', () => {
    const errors = validateTaskForm({ ...base, startTime: '10:00', endTime: '09:00' });
    expect(errors.endTime).toBeDefined();
  });

  it('结束时间晚于开始时间通过', () => {
    const errors = validateTaskForm({ ...base, startTime: '10:00', endTime: '11:00' });
    expect(errors.endTime).toBeUndefined();
  });

  it('地点 / 备注超长报错', () => {
    expect(validateTaskForm({ ...base, location: 'a'.repeat(81) }).location).toBeDefined();
    expect(validateTaskForm({ ...base, note: 'a'.repeat(301) }).note).toBeDefined();
  });
});
