import { AriaAttributes, FC, ReactNode, useId } from 'react';

import { Checkbox } from '../Checkbox';
import { RadioButton } from '../RadioButton';
import { TextArea } from '../TextArea';
import { Typography } from '../Typography';
import styles from './index.module.scss';
import {
  Choice,
  QuestionAnswer,
  QuestionDescriptor,
  QuestionType,
} from './types';

export * from './types';

export interface PollQuestionProps<T extends QuestionType> {
  disabled?: boolean;

  title: string;
  descriptor: QuestionDescriptor<T>;
  answer: QuestionAnswer<T> | undefined;
  onAnswerChanged: (value: QuestionAnswer<T>) => void;
}

type OptionGroupProps = {
  choices: Choice[];
  children: (id: string | number, index: number, title: string) => ReactNode;
};

function OptionGroup({ choices, children }: OptionGroupProps) {
  return (
    <div className={styles['option-group']}>
      {choices.map(({ id, title }, index) => children(id, index, title))}
    </div>
  );
}

interface ContentTypeProps<T extends QuestionType = QuestionType>
  extends AriaAttributes {
  disabled?: boolean;

  descriptor: QuestionDescriptor<T>;
  answer: QuestionAnswer<T> | undefined;
  onAnswerChanged: (value: QuestionAnswer<T>) => void;
}

type ContentComponentMap = Omit<
  {
    [T in QuestionType]: FC<ContentTypeProps<T>>;
  },
  'checkbox'
>;

function TextContent({
  disabled,
  answer,
  onAnswerChanged,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  descriptor: _descriptor,
  ...rest
}: ContentTypeProps<'text'>) {
  return (
    <TextArea
      disabled={disabled}
      value={answer?.text}
      onTextChanged={(text) => {
        onAnswerChanged({ text });
      }}
      {...rest}
    />
  );
}

function MultiCheckboxContent({
  disabled,
  descriptor,
  answer,
  onAnswerChanged,
  ...rest
}: ContentTypeProps<'multicheckbox'>) {
  const selectedIndices = answer?.selectedIndices ?? [];

  return (
    <OptionGroup choices={descriptor.options} {...rest}>
      {(id, index, title) => (
        <Checkbox
          key={id}
          disabled={disabled}
          checked={selectedIndices.includes(index)}
          onCheckedChanged={(state) => {
            onAnswerChanged({
              selectedIndices: state
                ? [...selectedIndices, index]
                : selectedIndices.filter((value) => value !== index),
            });
          }}
        >
          {title}
        </Checkbox>
      )}
    </OptionGroup>
  );
}

function RadioContent({
  disabled,
  descriptor,
  answer,
  onAnswerChanged,
  ...rest
}: ContentTypeProps<'radio'>) {
  return (
    <OptionGroup choices={descriptor.options} {...rest}>
      {(id, index, title) => (
        <RadioButton
          key={id}
          disabled={disabled}
          checked={answer?.selectedIndex === index}
          onCheckedChanged={(state) => {
            if (state) {
              onAnswerChanged({ selectedIndex: index });
            }
          }}
        >
          {title}
        </RadioButton>
      )}
    </OptionGroup>
  );
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
