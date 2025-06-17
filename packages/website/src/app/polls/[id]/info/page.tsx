import styles from './page.module.scss';
import { notFound } from '@shared/responses';
import { Route } from './+types/page';
import { omitProperty } from '@/utils/object/omit';
import { Repository } from '@data/repo';
import { UserRole } from '@data/types/user';
import { redirect } from 'react-router';
import { getSessionIdNumber } from '@/api/auth';
import { closePoll } from '@/api/polls/client';
import { Button } from '@/components/Button';
import { useNotification } from '@/components/Notification';
import { Prefixed } from '@/components/Prefixed';
import { Tab } from '@/components/Tab';
import { Tabs } from '@/components/Tabs';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';
import { useState } from 'react';
import { ResultsTab } from './tabs/results';
import { formatDateTime } from '@shared/date';

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
  const [isPollClosed, setPollClosed] = useState(poll.endDate !== null);
  const notification = useNotification();

  return (
    <div className={styles.content}>
      <Title>{`${poll.title} | Інформація`}</Title>

      <div className={styles.header}>
        <Typography variant="h5">{poll.title}</Typography>

        {!isPollClosed && (
          <Button
            className={styles.close}
            onClick={() => {
              closePoll(poll.id)
                .then(() => {
                  setPollClosed(true);

                  notification.show('Опитування закрите', 'plain');
                })
                .catch((error: unknown) => {
                  console.error(error);

                  notification.show('Сталася помилка', 'error');
                });
            }}
          >
            Закрити опитування
          </Button>
        )}
      </div>

      <Prefixed value="Дата початку">{formatDateTime(poll.startDate)}</Prefixed>

      {poll.endDate && (
        <Prefixed value="Дата закінчення">
          {formatDateTime(poll.endDate)}
        </Prefixed>
      )}

      <Tabs>
        <Tab tabId="results" title="Результати">
          <ResultsTab pollId={poll.id} />
        </Tab>
      </Tabs>
    </div>
  );
}
