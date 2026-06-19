export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  stats: {
    todayPending: number;
    totalPublished: number;
    totalCompleted: number;
  };
  categories: {
    work: number;
    personal: number;
    activity: number;
  };
};

/** 登录接口响应 data */
export type LoginResponse = {
  token: string;
  user: UserProfile;
};

/** 统一 API 响应模型 */
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};
