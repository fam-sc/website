import { UserPersonalInfo, UserRole } from '@data/types/user';
import { ChangePasswordPayload, UserInfo, UserInfoWithRole } from './types';
import { apiCheckedFetch, apiFetchObject } from '../fetch';

export function uploadUserAvatar(body: BodyInit) {
  return apiCheckedFetch(`/api/users/avatar`, {
    method: 'POST',
    body,
  });
}

export function changeUserRole(userId: string, role: UserRole) {
  return apiCheckedFetch(`/api/users/${userId}/role?value=${role}`, {
    method: 'POST',
  });
}
export function approveUser(userId: string) {
  return changeUserRole(userId, UserRole.STUDENT);
}

export function disapproveUser(userId: string) {
  return apiCheckedFetch(`/api/users/${userId}/disapprove`, {
    method: 'POST',
  });
}

export function getUsersForApprove(): Promise<UserInfo[]> {
  return apiFetchObject(`/api/users/approveList`);
}

export function getAllUsers(page: number): Promise<UserInfoWithRole[]> {
  return apiFetchObject(`/api/users?page=${page}`);
}

export function updateUserPersonalInfo(info: UserPersonalInfo) {
  return apiCheckedFetch(`/api/users/personal`, {
    method: 'PUT',
    body: info,
    json: true,
  });
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiCheckedFetch(`/api/users/password`, {
    method: 'PUT',
    body: payload,
    json: true,
  });
}

export function logOut() {
  return apiCheckedFetch(`/api/users/logOut`, {
    method: 'POST',
  });
}
