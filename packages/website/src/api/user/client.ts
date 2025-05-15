import { UserRole } from '@data/types/user';
import { checkedFetch, fetchObject } from '@shared/fetch';
import { UserInfo, UserInfoWithRole } from './types';

export function uploadUserAvatar(body: BodyInit) {
  return checkedFetch(`/api/user/avatar`, {
    method: 'POST',
    body,
  });
}

export function changeUserRole(userId: string, role: UserRole) {
  return checkedFetch(`/api/user/${userId}/role?value=${role}`, {
    method: 'POST',
  });
}
export function approveUser(userId: string) {
  return changeUserRole(userId, UserRole.STUDENT);
}

export function disapproveUser(userId: string) {
  return checkedFetch(`/api/user/${userId}/disapprove`, {
    method: 'POST',
  });
}

export function getUsersForApprove(): Promise<UserInfo[]> {
  return fetchObject(`/api/user/approveList`);
}

export function getAllUsers(page: number): Promise<UserInfoWithRole[]> {
  return fetchObject(`/api/users?page=${page}`);
}
