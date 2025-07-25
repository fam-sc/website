import { createContext, ReactNode } from 'react';

import { UserWithRoleAndAvatar } from '@/api/users/types';
import { contextUseFactory } from '@/utils/react/contextFactory';

export type AuthContextInfo = {
  user: UserWithRoleAndAvatar | null;
};

const AuthContext = createContext<AuthContextInfo | null>(null);

export function AuthProvider({
  value,
  children,
}: {
  value: AuthContextInfo;
  children: ReactNode;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthInfo = contextUseFactory(AuthContext, 'AuthContext');
