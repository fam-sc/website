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
  title: string;
  descriptor: QuestionDescriptor<T>;
  answer: QuestionAnswer<T> | undefined;
  onAnswerChanged: (value: QuestionAnswer<T>) => void;
}

type OptionGroupProps = {
  choices: Choice[];
  children: (id: string, title: string) => ReactNode;
};

function OptionGroup({ choices, children }: OptionGroupProps) {
  return (
    <div className={styles['option-group']}>
      {choices.map(({ id, title }) => children(id, title))}
    </div>
  );
}

type ContentTypeProps<T extends QuestionType = QuestionType> = {
  descriptor: QuestionDescriptor<T>;
  answer: QuestionAnswer<T> | undefined;
  onAnswerChanged: (value: QuestionAnswer<T>) => void;
};

type ContentComponentMap = {
  [T in QuestionType]: FC<ContentTypeProps<T>>;
};

function TextContent({ answer, onAnswerChanged }: ContentTypeProps<'text'>) {
  return (
    <TextArea
      value={answer?.text}
      onTextChanged={(text) => {
        onAnswerChanged({ text });
      }}
    />
  );
}

function CheckboxContent({
  descriptor,
  answer,
  onAnswerChanged,
}: ContentTypeProps<'checkbox'>) {
  const selectedIds = answer?.selectedIds ?? [];

  return (
    <OptionGroup choices={descriptor.options}>
      {(id, title) => (
        <Checkbox
          key={id}
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
  descriptor,
  answer,
  onAnswerChanged,
}: ContentTypeProps<'radio'>) {
  return (
    <OptionGroup choices={descriptor.choices}>
      {(id, title) => (
        <RadioButton
          key={id}
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
        descriptor={descriptor}
        answer={answer}
        onAnswerChanged={onAnswerChanged}
      />
    </fieldset>
  );
}
