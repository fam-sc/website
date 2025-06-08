import { Repository } from '@data/repo';
import { ClientComponent } from './client';
import { redirect } from 'react-router';
import { Route } from './+types/page';
import { getSessionIdNumber } from '@shared/api/auth';

export async function loader({ request }: Route.LoaderArgs) {
  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return redirect('/');
  }

  await using repo = await Repository.openConnection();
  const pi = await repo.sessions().getUserPersonalInfo(sessionId);
  if (pi === null) {
    return redirect('/');
  }

  return pi;
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return <ClientComponent personalInfo={loaderData} />;
}
