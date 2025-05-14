import { getCurrentUserInfo } from '@/auth/session/next';
import { UserRole } from '@data/types/user';
import { redirect, RedirectType } from 'next/navigation';
import { ClientComponent } from './client';

export default async function Page() {
  const userInfo = await getCurrentUserInfo();
  if (userInfo === null) {
    redirect('/', RedirectType.replace);
  }

  if (userInfo.role < UserRole.GROUP_HEAD) {
    redirect('/u/info', RedirectType.replace);
  }

  return <ClientComponent />;
}
