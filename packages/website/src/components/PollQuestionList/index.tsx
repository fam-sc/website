import { classNames } from '@/utils/classNames';
import {
  PollQuestion,
  QuestionAnswer,
  QuestionDescriptor,
} from '../PollQuestion';
import styles from './index.module.scss';

type QuestionItem = {
  key: string;
  title: string;
  descriptor: QuestionDescriptor;
};

export type AnswerMap = Record<string, QuestionAnswer>;

export type PollQuestionListProps = {
  className?: string;
  items: QuestionItem[];
  answers: AnswerMap;
  onAnswersChanged: (value: AnswerMap) => void;
};

export function PollQuestionList({
  items,
  answers,
  className,
  onAnswersChanged,
}: PollQuestionListProps) {
  return (
    <ul className={classNames(styles.root, className)}>
      {items.map(({ key, title, descriptor }) => (
        <PollQuestion
          key={key}
          descriptor={descriptor}
          answer={answers[key]}
          title={title}
          onAnswerChanged={(answer) => {
            onAnswersChanged({ ...answers, [key]: answer });
          }}
        />
      ))}
    </ul>
  );
}
