import { PageProps } from '@/types/next';
import { Repository } from '@data/repo';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUserInfo } from '@/api/user/client';
import { IconLinkButton } from '@/components/IconLinkButton';
import { Typography } from '@/components/Typography';
import { InfoIcon } from '@/icons/InfoIcon';
import { UserRole } from '@shared/api/user/types';

import styles from './page.module.scss';
import { PollWithSubmit } from './PollWithSubmit';
import { cache, PropsWithChildren } from 'react';
import { Metadata } from 'next';

type PollPageProps = PageProps<{ id: string }>;

function ErrorMessage({ children }: PropsWithChildren) {
  return (
    <Typography className={styles['error-message']} variant="h5">
      {children}
    </Typography>
  );
}

const getPoll = cache(async (id: string) => {
  await using repo = await Repository.openConnection();

  return await repo.polls().findById(id);
});

export async function generateMetadata({
  params,
}: PollPageProps): Promise<Metadata> {
  const { id } = await params;

  const poll = await getPoll(id);

  if (poll === null) {
    return {};
  }

  return {
    title: poll.title,
    openGraph: {
      title: poll.title,
    },
  };
}

export default async function Page({ params }: PollPageProps) {
  const { id } = await params;

  const userInfo = await getCurrentUserInfo();
  if (userInfo === null || userInfo.role < UserRole.STUDENT) {
    redirect('/polls');
  }

  const poll = await getPoll(id);
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
