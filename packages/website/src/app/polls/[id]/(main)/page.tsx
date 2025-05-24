import { PageProps } from '@/types/next';
import { Repository } from '@data/repo';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUserInfo } from '@/auth/session/next';
import { IconLinkButton } from '@/components/IconLinkButton';
import { Typography } from '@/components/Typography';
import { InfoIcon } from '@/icons/InfoIcon';
import { UserRole } from '@data/types/user';

import styles from './page.module.scss';
import { PollWithSubmit } from './PollWithSubmit';
import { PropsWithChildren } from 'react';

function ErrorMessage({ children }: PropsWithChildren) {
  return (
    <Typography className={styles['error-message']} variant="h5">
      {children}
    </Typography>
  );
}

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params;

  const userInfo = await getCurrentUserInfo();
  if (userInfo === null || userInfo.role < UserRole.STUDENT) {
    redirect('/polls');
  }

  await using repo = await Repository.openConnection();

  const poll = await repo.polls().findById(id);
  if (poll === null) {
    notFound();
  }

  const userReposponded = poll.respondents.find(
    (respondent) => respondent.userId.toString() === userInfo.id
  );

  const isPollEnded = poll.endDate !== null;
  const canViewInfo = userInfo.role >= UserRole.ADMIN;

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <Typography variant="h5">{poll.title}</Typography>

        {canViewInfo && (
          <IconLinkButton
            className={styles.info}
            hover="fill"
            href={`/polls/${id}/info`}
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
        <PollWithSubmit id={id} questions={poll.questions} />
      )}
    </div>
  );
}
