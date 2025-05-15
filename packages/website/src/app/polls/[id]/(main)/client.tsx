'use client';

import { Poll } from '@/api/polls/types';
import styles from './page.module.scss';
import { PollQuestionList } from '@/components/PollQuestionList';
import { useMemo, useState } from 'react';
import { Button } from '@/components/Button';
import {
  QuestionAnswer,
  QuestionDescriptor,
  QuestionType,
} from '@/components/PollQuestion';
import { submitPoll } from '@/api/polls/client';
import { useNotification } from '@/components/Notification';
import { useRouter } from 'next/navigation';
import { Typography } from '@/components/Typography';
import { InfoIcon } from '@/icons/InfoIcon';
import { IconLinkButton } from '@/components/IconLinkButton';
import { useAuthInfo } from '@/auth/context';
import { UserRole } from '@data/types/user';

type PollWithId = Poll & { id: string };

export type ClientComponentProps = {
  poll: PollWithId;
};

function isAnswerValid<T extends QuestionType>(
  answer: QuestionAnswer<T>,
  descriptor: QuestionDescriptor<T>
) {
  if ('text' in answer) {
    return answer.text.length > 0;
  }

  if ('selectedIndex' in answer) {
    return answer.selectedIndex !== undefined;
  }

  if ('selectedIndices' in answer) {
    return answer.selectedIndices.length > 0;
  }

  if (
    'status' in answer &&
    descriptor.type === 'checkbox' &&
    (descriptor as QuestionDescriptor<'checkbox'>).requiredTrue
  ) {
    return answer.status;
  }

  return true;
}

function getEmptyAnswer(type: QuestionType): QuestionAnswer {
  switch (type) {
    case 'text': {
      return { text: '' };
    }
    case 'multicheckbox': {
      return { selectedIndices: [] };
    }
    case 'radio': {
      return { selectedIndex: undefined };
    }
    case 'checkbox': {
      return { status: false };
    }
  }
}

export function ClientComponent({ poll }: ClientComponentProps) {
  const [isActionPending, setIsActionPending] = useState(false);
  const [answers, setAnswers] = useState<QuestionAnswer[]>(() => {
    return poll.questions.map(({ type }) => getEmptyAnswer(type));
  });

  const notification = useNotification();
  const router = useRouter();

  const { user } = useAuthInfo();
  const canViewInfo = user !== null && user.role >= UserRole.ADMIN;

  const pollItems = useMemo(() => {
    return poll.questions.map((question) => ({
      title: question.title,
      descriptor: {
        type: question.type,
        requiredTrue:
          question.type === 'checkbox' ? question.requiredTrue : false,
        choices:
          question.type === 'multicheckbox' || question.type === 'radio'
            ? question.options.map(({ title }, j) => ({ id: j, title }))
            : [],
      },
    }));
  }, [poll]);

  const isAnswersValid = answers.every((answer, i) =>
    isAnswerValid(answer, pollItems[i].descriptor)
  );

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <Typography variant="h5">{poll.title}</Typography>

        {canViewInfo && (
          <IconLinkButton
            className={styles.info}
            hover="fill"
            href={`/polls/${poll.id}/info`}
          >
            <InfoIcon />
          </IconLinkButton>
        )}
      </div>

      <PollQuestionList
        disabled={isActionPending}
        items={pollItems}
        answers={answers}
        onAnswersChanged={setAnswers}
      />

      <Button
        disabled={!isAnswersValid || isActionPending}
        className={styles.submit}
        buttonVariant="solid"
        onClick={() => {
          setIsActionPending(true);

          submitPoll(poll.id, { answers: answers })
            .then(() => {
              router.push('/polls');

              notification.show('Ваш відповіді зараховані', 'plain');
            })
            .catch(() => {
              setIsActionPending(false);

              notification.show('Сталася помилка', 'error');
            });
        }}
      >
        Відправити
      </Button>
    </div>
  );
}
