import { Typography } from '@/components/Typography';
import styles from './page.module.scss';
import { Button } from '@/components/Button';
import { closePoll } from '@/api/polls/client';
import { useNotification } from '@/components/Notification';
import { useState } from 'react';
import { Prefixed } from '@/components/Prefixed';
import { Tabs } from '@/components/Tabs';
import { Tab } from '@/components/Tab';
import { ResultsTab } from './tabs/results';
import { useCheckUserRole } from '@/hooks/useCheckUserRole';
import { UserRole } from '@shared/api/user/types';
import { Title } from '@/components/Title';

export type PollInfo = {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
};

export type ClientComponentProps = {
  poll: PollInfo;
};

export function ClientComponent({ poll }: ClientComponentProps) {
  useCheckUserRole(UserRole.ADMIN);

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

      <Prefixed value="Дата початку">{poll.startDate}</Prefixed>

      {poll.endDate && (
        <Prefixed value="Дата закінчення">{poll.endDate}</Prefixed>
      )}

      <Tabs>
        <Tab tabId="results" title="Результати">
          <ResultsTab pollId={poll.id} />
        </Tab>
      </Tabs>
    </div>
  );
}
