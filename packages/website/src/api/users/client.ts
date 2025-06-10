import { UserInfo, UserPersonalInfo } from '@shared/api/user/types';
import {
  ChangePasswordPayload,
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
import { SignInData, SignUpData } from '@shared/api/auth/types';

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

export function signIn(payload: SignInData) {
  return apiCheckedFetch('/api/signIn', {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function signUp(payload: SignUpData) {
  return apiCheckedFetch('/api/signUp', {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function finishSignUp(token: string) {
  return apiCheckedFetch(`/api/signUp/finish?token=${token}`, {
    method: 'POST',
  });
}

export function logOut() {
  return apiCheckedFetch(`/api/users/logOut`, {
    method: 'POST',
  });
}
export async function getCurrentUserInfo(): Promise<UserSelfInfo | null> {
  const response = await apiFetch(`/api/users/me`);

  // Unauthorized
  if (response.status === 401) {
    return null;
  } else if (!response.ok) {
    throw await getApiErrorFromResponse(response);
  }

  return await response.json();
}
