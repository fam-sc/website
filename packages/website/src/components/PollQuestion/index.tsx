import { AriaAttributes, FC, useId } from 'react';

import { Checkbox } from '../Checkbox';
import { Typography } from '../Typography';
import { MultiCheckboxContent } from './content/MultiCheckbox';
import { RadioContent } from './content/Radio';
import { TextContent } from './content/Text';
import { ContentComponentMap, ContentTypeProps } from './content/types';
import styles from './index.module.scss';
import { QuestionAnswer, QuestionDescriptor, QuestionType } from './types';

export * from './types';

export interface PollQuestionProps<T extends QuestionType> {
  disabled?: boolean;

  title: string;
  descriptor: QuestionDescriptor<T>;
  answer: QuestionAnswer<T> | undefined;
  onAnswerChanged: (value: QuestionAnswer<T>) => void;
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
  return (
    <div className={styles.root} {...rest}>
      <Checkbox
        checked={answer.status}
        onCheckedChanged={(status) => {
          onAnswerChanged({ status });
        }}
      >
        {title}
      </Checkbox>
    </div>
  );
}

const contentComponentMap: ContentComponentMap = {
  text: TextContent,
  multicheckbox: MultiCheckboxContent,
  radio: RadioContent,
};

export function PollQuestion<T extends QuestionType>({
  disabled,
  title,
  descriptor,
  answer,
  onAnswerChanged,
}: PollQuestionProps<T>) {
  const type = descriptor.type;
  const titleId = useId();

  if (type === 'checkbox') {
    return (
      <CheckboxQuestion
        title={title}
        answer={answer as QuestionAnswer<'checkbox'>}
        onAnswerChanged={onAnswerChanged}
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
        onAnswerChanged={onAnswerChanged}
        aria-labelledby={titleId}
      />
    </fieldset>
  );
}
