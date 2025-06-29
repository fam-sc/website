import { UserRole } from '@data/types/user';

import { Select } from '../Select';
import { UserInfoItem, UserInfoItemProps } from '../UserInfoItem';
import styles from './index.module.scss';

export interface UserRoleItemProps extends Omit<UserInfoItemProps, 'children'> {
  role: UserRole;
  onChangeRole: (role: UserRole) => void;
}

type UserRoleExceptAdmin = Exclude<UserRole, UserRole.ADMIN>;

const userRoles: UserRoleExceptAdmin[] = [
  UserRole.STUDENT_NON_APPROVED,
  UserRole.STUDENT,
  UserRole.GROUP_HEAD,
];

const roleLabelMap: Record<UserRoleExceptAdmin, string> = {
  [UserRole.STUDENT_NON_APPROVED]: 'Студент (не підтвержений)',
  [UserRole.STUDENT]: 'Студент',
  [UserRole.GROUP_HEAD]: 'Староста',
};

export function UserRoleItem({
  role,
  onChangeRole,
  ...rest
}: UserRoleItemProps) {
  return (
    <UserInfoItem {...rest}>
      <Select
        className={styles.select}
        items={userRoles.map((role) => ({
          key: role.toString(),
          title: roleLabelMap[role],
        }))}
        selectedItem={role.toString()}
        onItemSelected={(newRole) => {
          onChangeRole(Number.parseInt(newRole));
        }}
        placeholder=""
      />
    </UserInfoItem>
  );
}
