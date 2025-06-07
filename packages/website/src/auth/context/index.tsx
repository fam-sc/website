'use client';

import { UserWithRoleAndAvatar } from '@shared/api/user/types';
import { createContext, ReactNode, useContext } from 'react';

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

export function useAuthInfo(): AuthContextInfo {
  const result = useContext(AuthContext);

  if (result === null) {
    throw new Error('AuthContext in not in the tree');
  }

  return result;
}
