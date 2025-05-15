import { UserInfoWithRole } from '@/api/user/types';
import { classNames } from '@/utils/classNames';
import { UserRoleItem } from '../UserRoleItem';
import { UserRole } from '@data/types/user';
import { List } from '../List';

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
    <List className={classNames(className)}>
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
