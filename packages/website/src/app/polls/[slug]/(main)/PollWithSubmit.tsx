import { useNotification } from '@sc-fam/shared-ui';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { submitPoll } from '@/api/polls/client';
import type { Poll } from '@/api/polls/types';
import { Button } from '@/components/Button';
import { PollQuestionList } from '@/components/PollQuestionList';
import { getEmptyAnswer, isAnswerValid } from '@/services/polls/answer';
import { apiQuestionToItem } from '@/services/polls/question';

import styles from './PollWithSubmit.module.scss';

export type PollWithSubmitProps = {
  id: number;
  questions: Poll['questions'];
};

export function PollWithSubmit({ id, questions }: PollWithSubmitProps) {
  const notification = useNotification();
  const navigate = useNavigate();

  const [isActionPending, setIsActionPending] = useState(false);
  const [answers, setAnswers] = useState(() =>
    questions.map(({ type }) => getEmptyAnswer(type))
  );

  const pollItems = useMemo(
    () => questions.map((question) => apiQuestionToItem(question)),
    [questions]
  );

  const isAnswersValid = answers.every((answer, i) =>
    isAnswerValid(answer, pollItems[i].descriptor)
  );

  const onSubmitPoll = useCallback(() => {
    setIsActionPending(true);

    submitPoll(id, { answers })
      .then(() => {
        void navigate('/polls');

        notification.show('Ваш відповіді зараховані', 'plain');
      })
      .catch(() => {
        setIsActionPending(false);

        notification.show('Сталася помилка', 'error');
      });
  }, [answers, id, notification, navigate]);

  return (
    <div className={styles.content}>
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
        onClick={onSubmitPoll}
      >
        Відправити
      </Button>
    </div>
  );
}
