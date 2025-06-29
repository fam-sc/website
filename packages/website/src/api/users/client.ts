import { UserRole } from '@data/types/user';
import { ScheduleBotAuthPayload } from '@shared/api/schedulebot/types';

import type { SignInData, SignUpData } from '@/api/auth/types';
import type { ChangePasswordPayload } from '@/api/users/payloads';
import { UserInfo, UserPersonalInfo } from '@/api/users/types';
import { UserInfoWithRole } from '@/api/users/types';

import { apiCheckedFetch, apiFetchObject } from '../fetch';
import { ForgotPasswordPayload } from './forgotPassword/types';
import { ResetPasswordPayload } from './resetPassword/types';

export function uploadUserAvatar(body: BodyInit) {
  return apiCheckedFetch(`/users/avatar`, {
    method: 'POST',
    body,
  });
}

export function changeUserRole(userId: number, role: UserRole) {
  return apiCheckedFetch(`/users/${userId}/role?value=${role}`, {
    method: 'POST',
  });
}

export function approveUser(userId: number) {
  return changeUserRole(userId, UserRole.STUDENT);
}

export function disapproveUser(userId: number) {
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

export function authorizeScheduleBotToUser(payload: ScheduleBotAuthPayload) {
  return apiCheckedFetch('/users/scheduleBotAuth', {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiCheckedFetch('/users/forgotPassword', {
    method: 'POST',
    body: payload,
    json: true,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiCheckedFetch('/users/resetPassword', {
    method: 'POST',
    body: payload,
    json: true,
  });
}
