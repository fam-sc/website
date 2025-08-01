import { UserRole } from '@sc-fam/data';
import { TelegramBotAuthPayload } from '@sc-fam/shared/api/telegram/auth/types.js';

import { SignInData, SignUpData } from '@/api/auth/types';
import { ChangePasswordPayload } from '@/api/users/types';
import {
  UserInfo,
  UserInfoWithRole,
  UserPersonalInfo,
} from '@/api/users/types';

import { apiCheckedFetch, apiFetchObject } from '../fetch';
import { BotType } from './botAuth/types';
import { ForgotPasswordPayload } from './forgotPassword/types';
import { ResetPasswordPayload } from './resetPassword/types';
import { UpdateScheduleBotOptionsPayload } from './schedule/types';

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

export function authorizeTelegramBotToUser(
  type: BotType,
  payload: TelegramBotAuthPayload
) {
  return apiCheckedFetch(`/users/botAuth?type=${type}`, {
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

export function updateScheduleBotOptions(
  payload: UpdateScheduleBotOptionsPayload
) {
  return apiCheckedFetch('/users/schedule', {
    method: 'PUT',
    body: payload,
    json: true,
  });
}
