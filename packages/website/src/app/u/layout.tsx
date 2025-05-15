import { getCurrentUserInfo } from '@/auth/session/next';
import { redirect, RedirectType } from 'next/navigation';

import styles from './layout.module.scss';
import { TabInfo } from './types';
import { UserLayoutNavigation } from './nav';
import { UserAvatar } from './avatar';
import { mediaFileExists } from '@/api/media';
import { UserRole } from '@data/types/user';

const tabs: TabInfo[] = [
  { href: '/u/info', title: 'Загальне' },
  { href: '/u/approve', title: 'Підтвердження', minRole: UserRole.GROUP_HEAD },
  { href: '/u/roles', title: 'Ролі', minRole: UserRole.ADMIN },
];

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userInfo = await getCurrentUserInfo();
  if (userInfo === null) {
    redirect('/', RedirectType.replace);
  }

  const avatarExists = await mediaFileExists(`user/${userInfo.id}`);

  const tabsForRole = tabs.filter(
    ({ minRole }) => minRole === undefined || userInfo.role >= minRole
  );

  return (
    <div className={styles.root}>
      <div className={styles.navSide}>
        <UserAvatar
          className={styles.avatar}
          userId={userInfo.id}
          hasAvatar={avatarExists}
        />

        <UserLayoutNavigation tabs={tabsForRole} />
      </div>

      <div className={styles.tabContent}>{children}</div>
    </div>
  );
}
