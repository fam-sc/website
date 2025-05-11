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
  children: (id: string | number, index: number, title: string) => ReactNode;
};

function OptionGroup({ choices, children }: OptionGroupProps) {
  return (
    <div className={styles['option-group']}>
      {choices.map(({ id, title }, index) => children(id, index, title))}
    </div>
  );
}

type ContentTypeProps<T extends QuestionType = QuestionType> = {
  disabled?: boolean;

  descriptor: QuestionDescriptor<T>;
  answer: QuestionAnswer<T> | undefined;
  onAnswerChanged: (value: QuestionAnswer<T>) => void;
};

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

function MultiCheckboxContent({
  disabled,
  descriptor,
  answer,
  onAnswerChanged,
}: ContentTypeProps<'multicheckbox'>) {
  const selectedIndices = answer?.selectedIndices ?? [];

  return (
    <OptionGroup choices={descriptor.choices}>
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
}: ContentTypeProps<'radio'>) {
  return (
    <OptionGroup choices={descriptor.choices}>
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

type CheckboxQuestionProps = {
  title: string;
  answer: QuestionAnswer<'checkbox'>;
  onAnswerChanged: (value: QuestionAnswer<'checkbox'>) => void;
};

function CheckboxQuestion({
  title,
  answer,
  onAnswerChanged,
}: CheckboxQuestionProps) {
  return (
    <div className={styles.root}>
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

  if (type === 'checkbox') {
    return (
      <CheckboxQuestion
        title={title}
        answer={answer as QuestionAnswer<'checkbox'>}
        onAnswerChanged={onAnswerChanged}
      />
    );
  }

  const Content = contentComponentMap[type] as unknown as FC<
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
