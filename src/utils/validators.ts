export const validateTime = (time: string): boolean => {
  const pattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return pattern.test(time);
};

export const isTimeBefore = (time1: string, time2: string): boolean => {
  return time1 < time2;
};

export const validateTaskForm = (title: string, startTime: string, endTime?: string) => {
  const errors: string[] = [];
  
  if (!title.trim()) {
    errors.push('任务标题不能为空');
  } else if (title.trim().length > 50) {
    errors.push('任务标题最多50个字符');
  }
  
  if (!startTime) {
    errors.push('开始时间不能为空');
  } else if (!validateTime(startTime)) {
    errors.push('开始时间格式不正确，请使用HH:mm格式');
  }
  
  if (endTime) {
    if (!validateTime(endTime)) {
      errors.push('结束时间格式不正确，请使用HH:mm格式');
    } else if (!isTimeBefore(startTime, endTime)) {
      errors.push('结束时间不能早于开始时间');
    }
  }
  
  return errors;
};
