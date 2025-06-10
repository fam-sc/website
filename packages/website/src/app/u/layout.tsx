import styles from './layout.module.scss';
import { UserLayoutNavigation } from './nav';
import { UserAvatar } from './avatar';
import { ReactNode } from 'react';
import { redirect, useLoaderData } from 'react-router';
import { getSessionIdNumber } from '@shared/api/auth';
import { TabInfo, tabs } from './tabs';
import { Repository } from '@data/repo';
import { Route } from './+types/layout';

export interface UserLayoutProps {
  children: ReactNode;
}

type UserLayoutData = {
  tabs: TabInfo[];
  userId: string;
  avatarExists: boolean;
};

export async function loader({ request }: Route.LoaderArgs) {
  const sessionId = getSessionIdNumber(request);

  if (sessionId === undefined) {
    return redirect('/');
  }

  await using repo = await Repository.openConnection();
  const result = await repo.sessions().getUserWithRole(sessionId);
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

export default function Layout({ children }: UserLayoutProps) {
  const {
    user: { userId, avatarExists, tabs },
  } = useLoaderData<{ user: UserLayoutData }>();

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

      <div className={styles['tab-content']}>{children}</div>
    </div>
  );
}
