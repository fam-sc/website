import { LinkButton } from '@/components/LinkButton';
import { List } from '@/components/List';
import { TabInfo } from './tabs';
import { Button } from '@/components/Button';
import { logOut } from '@/api/users/client';
import styles from './nav.module.scss';
import { useLocation } from 'react-router';
import { classNames } from '@/utils/classNames';

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
