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

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
