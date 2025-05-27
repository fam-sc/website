import { classNames } from '@/utils/classNames';
import { List } from '../List';
import { UserApproveItem } from '../UserApproveItem';

import styles from './index.module.scss';

export type UserApproveItemType = {
  id: string;
  avatarSrc: string | undefined;
  name: string;
  email: string;
  group: string;
};

export type UserApproveBoardProps = {
  className?: string;
  items: UserApproveItemType[];

  onItemAction: (id: string, type: 'approve' | 'disapprove') => Promise<void>;
};

export function UserApproveBoard({
  className,
  items,
  onItemAction,
}: UserApproveBoardProps) {
  return (
    <List className={classNames(styles.root, className)}>
      {items.map(({ id, avatarSrc, name, group, email }) => (
        <UserApproveItem
          key={id}
          name={name}
          email={email}
          group={group}
          avatarSrc={avatarSrc}
          onAction={(type) => onItemAction(id, type)}
        />
      ))}
    </List>
  );
}
