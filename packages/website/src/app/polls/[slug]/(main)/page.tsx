import { UserRole } from '@sc-fam/data';
import { notFound } from '@sc-fam/shared';
import { PropsWithChildren } from 'react';
import { redirect } from 'react-router';

import { getSessionId } from '@/api/auth';
import { IconLinkButton } from '@/components/IconLinkButton';
import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';
import { InfoIcon } from '@/icons/InfoIcon';
import { repository } from '@/utils/repo';

import { Route } from './+types/page';
import styles from './page.module.scss';
import { PollWithSubmit } from './PollWithSubmit';

function ErrorMessage({ children }: PropsWithChildren) {
  return (
    <Typography className={styles['error-message']} variant="h5">
      {children}
    </Typography>
  );
}

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

  if (userInfo === null || userInfo.role < UserRole.STUDENT) {
    return redirect('/polls');
  }

  const poll = await repo.polls().findEndDateAndQuestionsBySlug(slug).get();

  if (poll === null) {
    return notFound();
  }

  const userResponded = await repo
    .polls()
    .hasUserResponded(poll.id, userInfo.id)
    .get();

  const canViewInfo = userInfo.role >= UserRole.ADMIN;

  return {
    poll,
    canViewInfo,
    userResponded,
  };
}

export default function Page({
  loaderData: { poll, canViewInfo, userResponded },
}: Route.ComponentProps) {
  const isPollEnded = poll.endDate !== null;

  return (
    <div className={styles.content}>
      <Title>{poll.title}</Title>

      <div className={styles.header}>
        <Typography variant="h5">{poll.title}</Typography>

        {canViewInfo && (
          <IconLinkButton
            className={styles.info}
            hover="fill"
            to={`/polls/${poll.slug}/info`}
          >
            <InfoIcon />
          </IconLinkButton>
        )}
      </div>

      {isPollEnded ? (
        <ErrorMessage>Опитування закінчилося</ErrorMessage>
      ) : userResponded ? (
        <ErrorMessage>Ви вже відповіли на це опитування</ErrorMessage>
      ) : (
        <PollWithSubmit id={poll.id} questions={poll.questions} />
      )}
    </div>
  );
}
