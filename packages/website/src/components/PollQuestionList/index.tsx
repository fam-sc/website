import { classNames } from '@/utils/classNames';
import {
  PollQuestion,
  QuestionAnswer,
  QuestionDescriptor,
} from '../PollQuestion';
import styles from './index.module.scss';
import { List } from '../List';

type QuestionItem = {
  title: string;
  descriptor: QuestionDescriptor;
};

export type PollQuestionListProps = {
  className?: string;
  disabled?: boolean;

  items: QuestionItem[];
  answers: QuestionAnswer[];
  onAnswersChanged: (value: QuestionAnswer[]) => void;
};

export function PollQuestionList({
  className,
  disabled,
  items,
  answers,
  onAnswersChanged,
}: PollQuestionListProps) {
  return (
    <List className={classNames(styles.root, className)}>
      {items.map(({ title, descriptor }, i) => (
        <li key={i}>
          <PollQuestion
            disabled={disabled}
            descriptor={descriptor}
            answer={answers[i]}
            title={title}
            onAnswerChanged={(answer) => {
              const copy = [...answers];
              copy[i] = answer;

              onAnswersChanged(copy);
            }}
          />
        </li>
      ))}
    </List>
  );
}
