import { IconLinkButton } from '@/components/IconLinkButton';
import { Typography } from '@/components/Typography';
import { InfoIcon } from '@/icons/InfoIcon';
import { UserRole } from '@shared/api/user/types';

import styles from './page.module.scss';
import { PollWithSubmit } from './PollWithSubmit';
import { PropsWithChildren } from 'react';
import { redirect } from 'react-router';
import { notFound } from '@shared/responses';

import { Route } from './+types/page';
import { omitProperty } from '@/utils/object/omit';
import { Title } from '@/components/Title';
import { Repository } from '@data/repo';
import { getSessionIdNumber } from '@shared/api/auth';

function ErrorMessage({ children }: PropsWithChildren) {
  return (
    <Typography className={styles['error-message']} variant="h5">
      {children}
    </Typography>
  );
}

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

  const poll = await repo.polls().findById(params.id);
  if (poll === null) {
    return notFound();
  }

  const userReposponded = poll.respondents.find(
    (respondent) => respondent.userId.toString() === userInfo.id
  );

  const isPollEnded = poll.endDate !== null;
  const canViewInfo = userInfo.role >= UserRole.ADMIN;

  return {
    poll: { id: poll._id.toString(), ...omitProperty(poll, '_id') },
    canViewInfo,
    isPollEnded,
    userReposponded,
  };
}

export default function Page({
  loaderData: { poll, canViewInfo, isPollEnded, userReposponded },
}: Route.ComponentProps) {
  return (
    <div className={styles.content}>
      <Title>{poll.title}</Title>

      <div className={styles.header}>
        <Typography variant="h5">{poll.title}</Typography>

        {canViewInfo && (
          <IconLinkButton
            className={styles.info}
            hover="fill"
            to={`/polls/${poll.id}/info`}
          >
            <InfoIcon />
          </IconLinkButton>
        )}
      </div>

      {isPollEnded ? (
        <ErrorMessage>Опитування закінчилося</ErrorMessage>
      ) : userReposponded ? (
        <ErrorMessage>Ви вже відповіли на це опитування</ErrorMessage>
      ) : (
        <PollWithSubmit id={poll.id} questions={poll.questions} />
      )}
    </div>
  );
}
