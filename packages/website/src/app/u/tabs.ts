import { UserRole } from '@data/types/user';

export type TabInfo = {
  href: string;
  title: string;
  minRole?: UserRole;
};

export const tabs: TabInfo[] = [
  { href: '/u/info', title: 'Загальне' },
  { href: '/u/password', title: 'Зміна паролю' },
  { href: '/u/approve', title: 'Підтвердження', minRole: UserRole.GROUP_HEAD },
  { href: '/u/schedule-bot', title: 'Бот розкладу', minRole: UserRole.STUDENT },
  { href: '/u/roles', title: 'Ролі', minRole: UserRole.ADMIN },
];
