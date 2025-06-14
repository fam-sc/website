import { UserInfoWithRole } from '@shared/api/user/types';
import { classNames } from '@/utils/classNames';
import { UserRoleItem } from '../UserRoleItem';
import { UserRole } from '@shared/api/user/types';
import { List } from '../List';
import styles from './index.module.scss';

export type UserRoleBoardProps = {
  className?: string;
  users: UserInfoWithRole[];

  onChangeRole: (id: string, role: UserRole) => void;
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
