import styles from './layout.module.scss';
import { UserLayoutNavigation } from './nav';
import { UserAvatar } from './avatar';
import { ReactNode } from 'react';
import { redirect } from 'react-router';
import { getSessionId } from '@/api/auth';
import { tabs } from './tabs';
import { Route } from './+types/layout';
import { Outlet } from 'react-router';
import { repository } from '@/utils/repo';

export interface UserLayoutProps {
  children: ReactNode;
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const sessionId = getSessionId(request);
  console.log(sessionId);

  if (sessionId === undefined) {
    return redirect('/');
  }

  const repo = repository(context);
  const result = await repo.sessions().getUserWithRole(sessionId);
  console.log(result);
  if (result === null) {
    return redirect('/');
  }

  const tabsForUser = tabs.filter(
    ({ minRole }) => minRole === undefined || result.role >= minRole
  );

  return {
    user: {
      avatarExists: result.hasAvatar ?? false,
      userId: result.id,
      tabs: tabsForUser,
    },
  };
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const {
    user: { userId, avatarExists, tabs },
  } = loaderData;

  return (
    <div className={styles.root}>
      <div className={styles['nav-side']}>
        <UserAvatar
          className={styles.avatar}
          userId={userId}
          hasAvatar={avatarExists}
        />

        <UserLayoutNavigation tabs={tabs} />
      </div>

      <div className={styles['tab-content']}>
        <Outlet />
      </div>
    </div>
  );
}
