import styles from './layout.module.scss';
import { TabInfo } from './types';
import { UserLayoutNavigation } from './nav';
import { UserAvatar } from './avatar';
import { UserRole } from '@shared/api/user/types';

const tabs: TabInfo[] = [
  { href: '/u/info', title: 'Загальне' },
  { href: '/u/password', title: 'Зміна паролю' },
  { href: '/u/approve', title: 'Підтвердження', minRole: UserRole.GROUP_HEAD },
  { href: '/u/roles', title: 'Ролі', minRole: UserRole.ADMIN },
];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
  const userInfo = await getCurrentUserInfo();
  const redirect = useNavigate();

  if (userInfo === null) {
    redirect('/', { replace: true });
    return;
  }

  const avatarExists = await mediaFileExists(`user/${userInfo.id}`);
  */

  const tabsForRole = tabs.filter(
    ({ minRole }) => minRole === undefined //|| userInfo.role >= minRole
  );

  return (
    <div className={styles.root}>
      <div className={styles['nav-side']}>
        <UserAvatar
          className={styles.avatar}
          userId={/* userInfo.id */ '1'}
          hasAvatar={true}
        />

        <UserLayoutNavigation tabs={tabsForRole} />
      </div>

      <div className={styles['tab-content']}>{children}</div>
    </div>
  );
}
