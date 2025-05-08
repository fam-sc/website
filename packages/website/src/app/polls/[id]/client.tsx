'use client';

import { Poll } from '@/api/polls/types';
import styles from './page.module.scss';
import { PollQuestionList } from '@/components/PollQuestionList';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { QuestionAnswer } from '@/components/PollQuestion';
import { submitPoll } from '@/api/polls/client';
import { useNotification } from '@/components/Notification';

type PollWithId = Poll & { id: string };

export type ClientComponentProps = {
  poll: PollWithId;
};

function isAnswerValid(value: QuestionAnswer) {
  return 'text' in value
    ? value.text.length > 0
    : 'selectedId' in value || 'selectedIds' in value;
}

export function ClientComponent({ poll }: ClientComponentProps) {
  const [isActionPending, setIsActionPending] = useState(false);
  const [answers, setAnswers] = useState<(QuestionAnswer | undefined)[]>([]);

  const notification = useNotification();

  const isAnswersValid =
    answers.length === poll.questions.length &&
    answers.every((answer) => answer !== undefined && isAnswerValid(answer));

  return (
    <div className={styles.content}>
      <PollQuestionList
        disabled={isActionPending}
        items={poll.questions.map(({ type, title, options }) => ({
          title,
          descriptor: {
            type,
            choices: options?.map(({ title }, j) => ({ id: j, title })) ?? [],
          },
        }))}
        answers={answers}
        onAnswersChanged={setAnswers}
      />

      <Button
        disabled={!isAnswersValid || isActionPending}
        className={styles.submit}
        buttonVariant="solid"
        onClick={() => {
          setIsActionPending(true);

          const pollAnswers = answers.map((answer) => {
            if (answer === undefined) {
              throw new Error('Invalid state: answer is undefined');
            }

            return 'text' in answer
              ? answer
              : 'selectedId' in answer
                ? { selectedIndex: answer.selectedId as number }
                : { selectedIndices: answer.selectedIds as number[] };
          });

          submitPoll(poll.id, { answers: pollAnswers })
            .then(() => {
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
