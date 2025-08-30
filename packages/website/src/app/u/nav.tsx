import { classNames } from '@sc-fam/shared';
import { useLocation } from 'react-router';

import { logOut } from '@/api/users/client';
import { Button } from '@/components/Button';
import { LinkButton } from '@/components/LinkButton';
import { List } from '@/components/List';

import styles from './nav.module.scss';
import { TabInfo } from './tabs';

type UserLayoutNavigationProps = {
  tabs: TabInfo[];
};

export function UserLayoutNavigation({ tabs }: UserLayoutNavigationProps) {
  const { pathname } = useLocation();

  return (
    <nav className={styles.root}>
      <List>
        {tabs.map(({ href, title }) => (
          <li key={href}>
            <LinkButton
              to={href}
              className={classNames(pathname === href && styles['link-active'])}
            >
              {title}
            </LinkButton>
          </li>
        ))}

        <li key="log-out">
          <Button
            onClick={() => {
              // eslint-disable-next-line unicorn/consistent-function-scoping
              const then = () => {
                // Don't use router navigation - it caches layout.
                // We need to reload it because the auth status changed.
                globalThis.location.href = '/';
              };

              logOut().then(then).catch(then);
            }}
          >
            Вийти
          </Button>
        </li>
      </List>
    </nav>
  );
}
