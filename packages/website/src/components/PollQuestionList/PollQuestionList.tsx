import { Dispatch, SetStateAction, useCallback } from 'react';

import { QuestionItem } from '@/services/polls/question';
import { QuestionAnswer } from '@/services/polls/types';
import { classNames } from '@/utils/classNames';

import { List } from '../List';
import { PollQuestion } from '../PollQuestion';
import styles from './PollQuestionList.module.scss';

export type PollQuestionListProps = {
  className?: string;
  disabled?: boolean;

  items: QuestionItem[];
  answers: QuestionAnswer[];
  onAnswersChanged: Dispatch<SetStateAction<QuestionAnswer[]>>;
};

export function PollQuestionList({
  className,
  disabled,
  items,
  answers,
  onAnswersChanged,
}: PollQuestionListProps) {
  const onItemChanged = useCallback(
    (answer: QuestionAnswer, index: number) => {
      onAnswersChanged((answers) => {
        const copy = [...answers];
        copy[index] = answer;

        return copy;
      });
    },
    [onAnswersChanged]
  );

  return (
    <List className={classNames(styles.root, className)}>
      {items.map((item, i) => (
        <li key={i}>
          <PollQuestion
            disabled={disabled}
            answer={answers[i]}
            data={i}
            onAnswerChanged={onItemChanged}
            {...item}
          />
        </li>
      ))}
    </List>
  );
}
