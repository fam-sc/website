import { getCurrentSessionId } from '@/auth/session/next';
import { Repository } from '@data/repo';
import { redirect, RedirectType } from 'next/navigation';
import { ClientComponent } from './client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Профіль',
};

export default async function Page() {
  const sessionId = await getCurrentSessionId();
  if (sessionId === undefined) {
    redirect('/', RedirectType.replace);
  }

  await using repo = await Repository.openConnection();
  const pi = await repo.sessions().getUserPersonalInfo(sessionId);
  if (pi === null) {
    redirect('/', RedirectType.replace);
  }

  return <ClientComponent personalInfo={pi} />;
}
