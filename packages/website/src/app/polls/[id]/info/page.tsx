import { ClientComponent } from './client';
import { formatDateTime } from '@shared/date';
import { notFound } from '@shared/responses';
import { Route } from './+types/page';
import { omitProperty } from '@/utils/object/omit';
import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { redirect } from 'react-router';
import { getSessionIdNumber } from '@/api/auth';

export async function loader({ request, params }: Route.LoaderArgs) {
  const sessionId = getSessionIdNumber(request);
  if (sessionId === undefined) {
    return redirect('/polls');
  }

  await using repo = await Repository.openConnection();
  const userInfo = await repo.sessions().getUserWithRole(sessionId);

  if (userInfo === null || userInfo.role < UserRole.STUDENT) {
    return redirect('/polls');
  }

  const poll = await repo.polls().findShortPoll(params.id);

  if (poll === null) {
    return notFound();
  }

  return { poll: { id: poll._id.toString(), ...omitProperty(poll, '_id') } };
}

export default function Page({ loaderData: { poll } }: Route.ComponentProps) {
  return (
    <ClientComponent
      poll={{
        id: poll.id,
        title: poll.title,
        startDate: formatDateTime(poll.startDate),
        endDate: poll.endDate ? formatDateTime(poll.endDate) : null,
      }}
    />
  );
}
