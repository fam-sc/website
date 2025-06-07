'use client';

import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@shared/api/user/types';
import { redirect } from 'next/navigation';

export function useCheckUserRole(minRole: UserRole) {
  const { user } = useAuthInfo();

  if (user === null || user.role < minRole) {
    redirect('/');
  }
}
