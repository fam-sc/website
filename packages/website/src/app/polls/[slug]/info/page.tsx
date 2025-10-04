import { UserRole } from '@sc-fam/data';
import { notFound } from '@sc-fam/shared';
import { formatDateTime } from '@sc-fam/shared/chrono';
import { useNotification } from '@sc-fam/shared-ui';
import { useState } from 'react';
import { redirect } from 'react-router';

import { getSessionId } from '@/api/auth';
import { closePoll } from '@/api/polls/client';
import { Button } from '@/components/Button';
import { PollSpreadsheetLinker } from '@/components/PollSpreadsheetLinker';
import { Prefixed } from '@/components/Prefixed';
import { Tab } from '@/components/Tab';
import { Tabs } from '@/components/Tabs';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import styles from './page.module.scss';
import { ResultsTab } from './tabs/results';

export async function loader({
  request,
  context,
  params: { slug },
}: Route.LoaderArgs) {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return redirect('/polls');
  }

  const repo = repository(context);
  const userInfo = await repo.sessions().getUserWithRole(sessionId);

  if (userInfo === null || userInfo.role < UserRole.ADMIN) {
    return redirect('/polls');
  }

  const poll = await repo.polls().findShortPollBySlug(slug);

  if (poll === null) {
    return notFound();
  }

  return { poll };
}

export default function Page({ loaderData: { poll } }: Route.ComponentProps) {
  const [isPollClosed, setPollClosed] = useState(poll.endDate !== null);
  const notification = useNotification();

  return (
    <div className={styles.content}>
      <Title>{`${poll.title} | Інформація`}</Title>

      <div className={styles.header}>
        <Typography variant="h5">{poll.title}</Typography>

        <PollSpreadsheetLinker
          className={styles['spreadsheet-linker']}
          pollId={poll.id}
        />

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

      <Prefixed value="Дата початку">
        {formatDateTime(new Date(poll.startDate))}
      </Prefixed>

      {poll.endDate && (
        <Prefixed value="Дата закінчення">
          {formatDateTime(new Date(poll.endDate))}
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
