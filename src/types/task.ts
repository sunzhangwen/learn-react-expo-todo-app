export type TaskCategory = 'work' | 'personal' | 'activity';

export type TaskStatus = 'pending' | 'completed';

export type Task = {
  id: string;
  title: string;
  category: TaskCategory;
  startTime: string;
  endTime?: string;
  location?: string;
  note?: string;
  date: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

/** 任务表单提交载荷：不含服务端维护的字段 */
export type TaskPayload = {
  title: string;
  category: TaskCategory;
  startTime: string;
  endTime?: string;
  location?: string;
  note?: string;
  date: string;
  status: TaskStatus;
};
