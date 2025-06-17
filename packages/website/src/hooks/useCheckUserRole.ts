import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@data/types/user';
import { useNavigate } from 'react-router';

export function useCheckUserRole(minRole: UserRole) {
  const { user } = useAuthInfo();
  const redirect = useNavigate();

  if (user === null || user.role < minRole) {
    void redirect('/');
  }
}
