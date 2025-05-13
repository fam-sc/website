import { getCurrentUserInfo } from '@/auth/session/next';
import { redirect, RedirectType } from 'next/navigation';

import styles from './layout.module.scss';
import { TabInfo } from './types';
import { UserLayoutNavigation } from './nav';
import { UserAvatar } from './avatar';
import { mediaFileExists } from '@/api/media';

const tabs: TabInfo[] = [{ href: '/u/info', title: 'Загальне' }];

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

  return (
    <div className={styles.root}>
      <div className={styles.navSide}>
        <UserAvatar
          className={styles.avatar}
          userId={userInfo.id}
          hasAvatar={avatarExists}
        />

        <UserLayoutNavigation tabs={tabs} />
      </div>

      <div className={styles.tabContent}>{children}</div>
    </div>
  );
}
