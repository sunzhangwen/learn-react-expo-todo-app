import { UserProfile } from '../types/user';
import { USE_MOCK } from '../constants/config';
import { mockUser } from '../mock/mockData';

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export const getProfile = async (): Promise<UserProfile> => {
  if (USE_MOCK) {
    await delay(300 + Math.random() * 200);
    return mockUser;
  }
  throw new Error('Not implemented');
};

export const logout = async (): Promise<boolean> => {
  if (USE_MOCK) {
    await delay(200);
    return true;
  }
  throw new Error('Not implemented');
};
