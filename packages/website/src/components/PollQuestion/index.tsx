import { FC, ReactNode } from 'react';
import styles from './index.module.scss';
import { Typography } from '../Typography';
import { TextArea } from '../TextArea';
import { Checkbox } from '../Checkbox';
import {
  QuestionDescriptor,
  QuestionAnswer,
  Choice,
  QuestionType,
} from './types';
import { RadioButton } from '../RadioButton';

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
  children: (id: string | number, title: string) => ReactNode;
};

function OptionGroup({ choices, children }: OptionGroupProps) {
  return (
    <div className={styles['option-group']}>
      {choices.map(({ id, title }) => children(id, title))}
    </div>
  );
}

type ContentTypeProps<T extends QuestionType = QuestionType> = {
  disabled?: boolean;

  descriptor: QuestionDescriptor<T>;
  answer: QuestionAnswer<T> | undefined;
  onAnswerChanged: (value: QuestionAnswer<T>) => void;
};

type ContentComponentMap = {
  [T in QuestionType]: FC<ContentTypeProps<T>>;
};

function TextContent({
  disabled,
  answer,
  onAnswerChanged,
}: ContentTypeProps<'text'>) {
  return (
    <TextArea
      disabled={disabled}
      value={answer?.text}
      onTextChanged={(text) => {
        onAnswerChanged({ text });
      }}
    />
  );
}

function CheckboxContent({
  disabled,
  descriptor,
  answer,
  onAnswerChanged,
}: ContentTypeProps<'checkbox'>) {
  const selectedIds = answer?.selectedIds ?? [];

  return (
    <OptionGroup choices={descriptor.choices}>
      {(id, title) => (
        <Checkbox
          key={id}
          disabled={disabled}
          checked={selectedIds.includes(id)}
          onCheckedChanged={(state) => {
            onAnswerChanged({
              selectedIds: state
                ? [...selectedIds, id]
                : selectedIds.filter((value) => value !== id),
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
}: ContentTypeProps<'radio'>) {
  return (
    <OptionGroup choices={descriptor.choices}>
      {(id, title) => (
        <RadioButton
          key={id}
          disabled={disabled}
          checked={answer?.selectedId === id}
          onCheckedChanged={(state) => {
            if (state) {
              onAnswerChanged({ selectedId: id });
            }
          }}
        >
          {title}
        </RadioButton>
      )}
    </OptionGroup>
  );
}

const contentComponentMap: ContentComponentMap = {
  text: TextContent,
  checkbox: CheckboxContent,
  radio: RadioContent,
};

export function PollQuestion<T extends QuestionType>({
  disabled,
  title,
  descriptor,
  answer,
  onAnswerChanged,
}: PollQuestionProps<T>) {
  const Content = contentComponentMap[descriptor.type] as FC<
    ContentTypeProps<T>
  >;

  return (
    <fieldset className={styles.root}>
      <Typography as="legend" variant="bodyLarge">
        {title}
      </Typography>

      <Content
        disabled={disabled}
        descriptor={descriptor}
        answer={answer}
        onAnswerChanged={onAnswerChanged}
      />
    </fieldset>
  );
}
