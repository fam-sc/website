import { UserRole } from '@sc-fam/data';
import { classNames } from '@sc-fam/shared';

import { UserInfoWithRole } from '@/api/users/types';

import { List } from '../List';
import { UserRoleItem } from '../UserRoleItem';
import styles from './UserRoleBoard.module.scss';

export type UserRoleBoardProps = {
  className?: string;
  users: UserInfoWithRole[];

  onChangeRole: (id: number, role: UserRole) => void;
};

export function UserRoleBoard({
  className,
  users,
  onChangeRole,
}: UserRoleBoardProps) {
  return (
    <List className={classNames(styles.root, className)}>
      {users.map((user) => (
        <UserRoleItem
          {...user}
          key={user.id}
          role={user.role}
          onChangeRole={(role) => {
            onChangeRole(user.id, role);
          }}
        />
      ))}
    </List>
  );
}
