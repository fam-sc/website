

import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@shared/api/user/types';
import { useNavigate } from 'react-router';

export function useCheckUserRole(minRole: UserRole) {
  const { user } = useAuthInfo();
  const redirect = useNavigate();

  if (user === null || user.role < minRole) {
    redirect('/');
  }
}
