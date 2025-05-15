'use client';
// This component is refactored out into another file on purpose.
// In layout we don't know URL because layouts don't get re-rendered when the page in that layout changes.
// Because of that, even if we knew the initial URL, we don't get to know the current URL if a user client-navigates.
// That's why we have Client component that has access to the URL.

import { LinkButton } from '@/components/LinkButton';
import { List } from '@/components/List';
import { TabInfo } from './types';
import { usePathname } from 'next/navigation';

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
      </List>
    </nav>
  );
}
