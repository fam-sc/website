import { useState } from 'react';
import { redirect } from 'react-router';

import { getSessionId } from '@/api/auth';
import { TelegramBotLinker } from '@/components/TelegramBotLinker';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import styles from './page.module.scss';
import { ScheduleBotForm } from './ScheduleBotForm';

export async function loader({ request, context }: Route.LoaderArgs) {
  const sessionId = getSessionId(request);
  if (sessionId === undefined) {
    return redirect('/');
  }

  const repo = repository(context);
  const userId = await repo.sessions().getUserIdBySessionId(sessionId);
  if (userId === null) {
    return redirect('/');
  }

  const options = await repo.scheduleBotUsers().getOptionsByUserId(userId);

  return options;
}

export default function Page({ loaderData: options }: Route.ComponentProps) {
  const [isAuthorized, setAuthorized] = useState(options !== null);

  return (
    <div className={styles.root}>
      {isAuthorized ? (
        <ScheduleBotForm initial={options} />
      ) : (
        <TelegramBotLinker
          bot="famschedulebot"
          botType="schedule"
          onAuthorized={() => setAuthorized(true)}
        />
      )}
    </div>
  );
}
