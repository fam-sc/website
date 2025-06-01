'use client';

import { submitPoll } from '@/api/polls/client';
import { Poll } from '@/api/polls/types';
import { Button } from '@/components/Button';
import { useNotification } from '@/components/Notification';
import {
  QuestionAnswer,
  QuestionDescriptor,
  QuestionType,
} from '@/components/PollQuestion';
import { PollQuestionList } from '@/components/PollQuestionList';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';

import styles from './PollWithSubmit.module.scss';

export type PollWithSubmitProps = {
  id: string;
  questions: Poll['questions'];
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

export function PollWithSubmit({ id, questions }: PollWithSubmitProps) {
  const [isActionPending, setIsActionPending] = useState(false);
  const [answers, setAnswers] = useState<QuestionAnswer[]>(() => {
    return questions.map(({ type }) => getEmptyAnswer(type));
  });

  const notification = useNotification();
  const router = useRouter();

  const pollItems = useMemo(() => {
    return questions.map((question) => ({
      title: question.title,
      descriptor: {
        type: question.type,
        requiredTrue:
          question.type === 'checkbox' ? question.requiredTrue : false,
        options:
          question.type === 'multicheckbox' || question.type === 'radio'
            ? question.options.map(({ title }, j) => ({ id: j, title }))
            : [],
      },
    }));
  }, [questions]);

  const isAnswersValid = answers.every((answer, i) =>
    isAnswerValid(answer, pollItems[i].descriptor)
  );

  const onSubmitPoll = useCallback(() => {
    setIsActionPending(true);

    submitPoll(id, { answers })
      .then(() => {
        router.push('/polls');

        notification.show('Ваш відповіді зараховані', 'plain');
      })
      .catch(() => {
        setIsActionPending(false);

        notification.show('Сталася помилка', 'error');
      });
  }, [answers, id, notification, router]);

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
