import { UserRole } from '@data/types/user';

export interface UserInfo {
  id: string;
  name: string;
  group: string;
  email: string;

  hasAvatar: boolean;
}

export interface UserInfoWithRole extends UserInfo {
  role: UserRole;
}
