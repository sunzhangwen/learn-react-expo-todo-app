export const TITLE_MAX_LENGTH = 50;
export const LOCATION_MAX_LENGTH = 80;
export const NOTE_MAX_LENGTH = 300;

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** 校验 HH:mm 格式。 */
export function isValidTime(value: string): boolean {
  return TIME_PATTERN.test(value.trim());
}

/** 把 HH:mm 转为当天分钟数，便于比较。非法格式返回 NaN。 */
export function timeToMinutes(value: string): number {
  if (!isValidTime(value)) {
    return NaN;
  }
  const [h, m] = value.split(':').map((v) => parseInt(v, 10));
  return h * 60 + m;
}

export type TaskFormValues = {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  note: string;
};

/**
 * 校验任务表单（需求第 9 节校验规则），返回字段级错误信息。
 * 没有错误时返回空对象。
 */
export function validateTaskForm(values: TaskFormValues): Partial<Record<keyof TaskFormValues, string>> {
  const errors: Partial<Record<keyof TaskFormValues, string>> = {};

  const title = values.title.trim();
  if (!title) {
    errors.title = '请输入任务标题';
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `标题最多 ${TITLE_MAX_LENGTH} 个字`;
  }

  const startTime = values.startTime.trim();
  if (!startTime) {
    errors.startTime = '请输入开始时间';
  } else if (!isValidTime(startTime)) {
    errors.startTime = '开始时间格式应为 HH:mm';
  }

  const endTime = values.endTime.trim();
  if (endTime) {
    if (!isValidTime(endTime)) {
      errors.endTime = '结束时间格式应为 HH:mm';
    } else if (isValidTime(startTime) && timeToMinutes(endTime) < timeToMinutes(startTime)) {
      errors.endTime = '结束时间不能早于开始时间';
    }
  }

  if (values.location.trim().length > LOCATION_MAX_LENGTH) {
    errors.location = `地点最多 ${LOCATION_MAX_LENGTH} 个字`;
  }

  if (values.note.trim().length > NOTE_MAX_LENGTH) {
    errors.note = `备注最多 ${NOTE_MAX_LENGTH} 个字`;
  }

  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
