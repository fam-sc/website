import { AriaAttributes, FC, useCallback, useId } from 'react';

import {
  QuestionAnswer,
  QuestionDescriptor,
  QuestionType,
} from '@/services/polls/types';

import { Checkbox } from '../Checkbox';
import { Typography } from '../Typography';
import { MultiCheckboxContent } from './content/MultiCheckbox';
import { RadioContent } from './content/Radio';
import { ScoreContent } from './content/Score';
import { TextContent } from './content/Text';
import { ContentComponentMap, ContentTypeProps } from './content/types';
import styles from './PollQuestion.module.scss';

export interface PollQuestionProps<T extends QuestionType, Data = unknown> {
  disabled?: boolean;

  title: string;
  data: Data;

  descriptor: QuestionDescriptor<T>;
  answer: QuestionAnswer<T> | undefined;
  onAnswerChanged: (value: QuestionAnswer<T>, data: Data) => void;
}

interface CheckboxQuestionProps extends AriaAttributes {
  title: string;
  answer: QuestionAnswer<'checkbox'>;
  onAnswerChanged: (value: QuestionAnswer<'checkbox'>) => void;
}

function CheckboxQuestion({
  title,
  answer,
  onAnswerChanged,
  ...rest
}: CheckboxQuestionProps) {
  const onCheckedChanged = useCallback(
    (status: boolean) => onAnswerChanged({ status }),
    [onAnswerChanged]
  );

  return (
    <div className={styles.root} {...rest}>
      <Checkbox checked={answer.status} onCheckedChanged={onCheckedChanged}>
        {title}
      </Checkbox>
    </div>
  );
}

const contentComponentMap: ContentComponentMap = {
  text: TextContent,
  multicheckbox: MultiCheckboxContent,
  radio: RadioContent,
  score: ScoreContent,
};

export function PollQuestion<T extends QuestionType, Data>({
  disabled,
  title,
  descriptor,
  answer,
  data,
  onAnswerChanged,
}: PollQuestionProps<T, Data>) {
  const { type } = descriptor;
  const titleId = useId();

  const onAnswerChangedWithData = useCallback(
    (answer: QuestionAnswer<T>) => {
      onAnswerChanged(answer, data);
    },
    [data, onAnswerChanged]
  );

  if (type === 'checkbox') {
    return (
      <CheckboxQuestion
        title={title}
        answer={answer as QuestionAnswer<'checkbox'>}
        onAnswerChanged={onAnswerChangedWithData}
      />
    );
  }

  const Content = (contentComponentMap as Record<T, unknown>)[type] as FC<
    ContentTypeProps<T>
  >;

  return (
    <fieldset className={styles.root}>
      <Typography as="legend" variant="bodyLarge" id={titleId}>
        {title}
      </Typography>

      <Content
        disabled={disabled}
        descriptor={descriptor}
        answer={answer}
        onAnswerChanged={onAnswerChangedWithData}
        aria-labelledby={titleId}
      />
    </fieldset>
  );
}
