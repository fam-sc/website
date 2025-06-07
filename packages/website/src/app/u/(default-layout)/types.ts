import { UserRole } from '@shared/api/user/types';

export type TabInfo = {
  href: string;
  title: string;
  minRole?: UserRole;
};
