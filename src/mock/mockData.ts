import { Task } from '../types/task';
import { UserProfile } from '../types/user';

const now = new Date();
const today = now.toISOString().slice(0, 10);

export const mockTasks: Task[] = [
  {
    id: '1',
    title: '公司年终复盘会议',
    category: 'work',
    startTime: '08:00',
    endTime: '10:00',
    date: today,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '部门年终总结分享会',
    category: 'work',
    startTime: '10:30',
    endTime: '12:00',
    date: today,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: '广州插画分享会',
    category: 'activity',
    startTime: '14:00',
    endTime: '16:00',
    location: '西西弗书店',
    date: today,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: '下班配钥匙',
    category: 'personal',
    startTime: '18:30',
    date: today,
    location: '下沙市场',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockUser: UserProfile = {
  id: 'u1',
  name: '测试用户',
  email: 'test@example.com',
  avatar: undefined,
  stats: {
    todayPending: 2,
    totalPublished: 4,
    totalCompleted: 0
  },
  categories: {
    work: 2,
    personal: 1,
    activity: 1
  }
};
