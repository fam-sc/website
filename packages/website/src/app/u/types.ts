import { UserRole } from '@data/types/user';

export type TabInfo = {
  href: string;
  title: string;
  minRole?: UserRole;
};
