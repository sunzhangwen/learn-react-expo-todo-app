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
