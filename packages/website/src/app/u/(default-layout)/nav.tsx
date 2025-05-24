'use client';
// This component is refactored out into another file on purpose.
// In layout we don't know URL because layouts don't get re-rendered when the page in that layout changes.
// Because of that, even if we knew the initial URL, we don't get to know the current URL if a user client-navigates.
// That's why we have Client component that has access to the URL.

import { LinkButton } from '@/components/LinkButton';
import { List } from '@/components/List';
import { TabInfo } from './types';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/Button';
import { logOut } from '@/api/user/client';

type UserLayoutNavigationProps = {
  tabs: TabInfo[];
};

export function UserLayoutNavigation({ tabs }: UserLayoutNavigationProps) {
  const currentPath = usePathname();

  return (
    <nav>
      <List>
        {tabs.map(({ href, title }) => (
          <li key={href}>
            <LinkButton href={href} data-current={href === currentPath}>
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
