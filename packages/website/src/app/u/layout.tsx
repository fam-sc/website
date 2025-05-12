import { getCurrentUserInfo } from '@/auth/session/next';
import { redirect, RedirectType } from 'next/navigation';

import styles from './layout.module.scss';
import Image from 'next/image';
import { TabInfo } from './types';
import { UserLayoutNavigation } from './nav';

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

  return (
    <div className={styles.root}>
      <div className={styles.navSide}>
        <div className={styles.avatar}>
          <Image
            src={
              'https://i.imgur.com/OEuYkKXl.png' /* getMediaFileUrl(`user/${userInfo.id}`) */
            }
            alt="Фотографія користувача"
            width={0}
            height={0}
          />
        </div>

        <UserLayoutNavigation tabs={tabs} />
      </div>

      <div className={styles.tabContent}>{children}</div>
    </div>
  );
}
