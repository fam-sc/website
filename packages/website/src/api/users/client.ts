import { UserInfo, UserPersonalInfo } from '@shared/api/user/types';
import {
  UserSelfInfo,
  UserInfoWithRole,
  UserRole,
} from '@shared/api/user/types';
import {
  apiCheckedFetch,
  apiFetch,
  apiFetchObject,
  getApiErrorFromResponse,
} from '../fetch';
import type { SignInData, SignUpData } from '@shared/api/auth/types';
import type { ChangePasswordPayload } from '@shared/api/user/payloads';

export function uploadUserAvatar(body: BodyInit) {
  return apiCheckedFetch(`/users/avatar`, {
    method: 'POST',
    body,
  });
}

export function changeUserRole(userId: string, role: UserRole) {
  return apiCheckedFetch(`/users/${userId}/role?value=${role}`, {
    method: 'POST',
  });
}
export function approveUser(userId: string) {
  return changeUserRole(userId, UserRole.STUDENT);
}

export function disapproveUser(userId: string) {
  return apiCheckedFetch(`/users/${userId}/disapprove`, {
    method: 'POST',
  });
}

export function getUsersForApprove(): Promise<UserInfo[]> {
  return apiFetchObject(`/users/approveList`);
}

export function getAllUsers(page: number): Promise<UserInfoWithRole[]> {
  return apiFetchObject(`/users?page=${page}`);
}

export function updateUserPersonalInfo(info: UserPersonalInfo) {
  return apiCheckedFetch(`/users/personal`, {
    method: 'PUT',
    body: info,
    json: true,
  });
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiCheckedFetch(`/users/password`, {
    method: 'PUT',
    body: payload,
    json: true,
  });
}

export function signIn(payload: SignInData) {
  return apiCheckedFetch('/signIn', {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function signUp(payload: SignUpData) {
  return apiCheckedFetch('/signUp', {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function finishSignUp(token: string) {
  return apiCheckedFetch(`/signUp/finish?token=${token}`, {
    method: 'POST',
  });
}

export function logOut() {
  return apiCheckedFetch(`/users/logOut`, {
    method: 'POST',
  });
}
export async function getCurrentUserInfo(): Promise<UserSelfInfo | null> {
  const response = await apiFetch(`/users/me`);

  // Unauthorized
  if (response.status === 401) {
    return null;
  } else if (!response.ok) {
    throw await getApiErrorFromResponse(response);
  }

  return await response.json();
}
