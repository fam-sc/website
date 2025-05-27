import { classNames } from '@/utils/classNames';
import { QuestionDescriptor, QuestionType } from '../PollQuestion/types';

import styles from './index.module.scss';
import { TextInput } from '../TextInput';
import { Select } from '../Select';
import { FC } from 'react';
import { OptionListBuilder } from '../OptionListBuilder';
import { QuestionBuildItem } from './item';
import { Checkbox } from '../Checkbox';

export type PollQuestionBuilderProps = {
  className?: string;
  disabled?: boolean;

  isError?: boolean;
  value: QuestionBuildItem;
  onValueChanged: (value: QuestionBuildItem) => void;
};

type ContentTypeProps<T extends QuestionType> = {
  disabled?: boolean;

  descriptor: QuestionDescriptor<T>;
  onDescriptorChanged: (value: QuestionDescriptor<T>) => void;
};

type ContentComponentMap = {
  [T in QuestionType]: FC<ContentTypeProps<T>>;
};

const questionTypeTitles: Record<QuestionType, string> = {
  text: 'Текст',
  checkbox: 'Прапорець',
  multicheckbox: 'Вибір (багато варіантів)',
  radio: 'Вибір (один варіант)',
};

const questionTypes = Object.keys(questionTypeTitles) as QuestionType[];

function optionListBuilderWrapper<T extends 'multicheckbox' | 'radio'>(
  type: T
) {
  // eslint-disable-next-line react/display-name
  return ({
    disabled,
    descriptor,
    onDescriptorChanged,
  }: ContentTypeProps<T>) => {
    return (
      <OptionListBuilder
        disabled={disabled}
        items={descriptor.choices.map(({ title }) => title)}
        onItemsChanged={(items) => {
          onDescriptorChanged({
            type,
            choices: items.map((title, id) => ({ id, title })),
          });
        }}
      />
    );
  };
}

function CheckboxContent({
  descriptor,
  onDescriptorChanged,
  disabled,
}: ContentTypeProps<'checkbox'>) {
  return (
    <Checkbox
      disabled={disabled}
      checked={descriptor.requiredTrue}
      onCheckedChanged={(state) => {
        onDescriptorChanged({ type: 'checkbox', requiredTrue: state });
      }}
    >
      {`Обов'язково має бути включеним`}
    </Checkbox>
  );
}

function getEmptyDescriptor(type: QuestionType): QuestionDescriptor {
  switch (type) {
    case 'text': {
      return { type };
    }
    case 'multicheckbox':
    case 'radio': {
      return { type, choices: [] };
    }
    case 'checkbox': {
      return { type, requiredTrue: false };
    }
  }
}

const contentComponentMap: ContentComponentMap = {
  text: () => null,
  checkbox: CheckboxContent,
  multicheckbox: optionListBuilderWrapper('multicheckbox'),
  radio: optionListBuilderWrapper('radio'),
};

export function PollQuestionBuilder({
  className,
  disabled,
  isError,
  value,
  onValueChanged,
}: PollQuestionBuilderProps) {
  const Content = value.descriptor
    ? (contentComponentMap[value.descriptor.type] as FC<
        ContentTypeProps<QuestionType>
      >)
    : null;

  return (
    <div className={classNames(styles.root, className)} data-error={isError}>
      <div className={styles.header}>
        <TextInput
          variant="underline"
          className={styles['title']}
          value={value.title}
          placeholder="Питання"
          disabled={disabled}
          onTextChanged={(title) => {
            onValueChanged({ ...value, title });
          }}
        />

        <Select
          className={styles['type-select']}
          placeholder="Виберіть тип"
          selectedItem={value.descriptor?.type}
          disabled={disabled}
          items={questionTypes.map((type) => ({
            key: type,
            title: questionTypeTitles[type],
          }))}
          onItemSelected={(type) => {
            onValueChanged({ ...value, descriptor: getEmptyDescriptor(type) });
          }}
        />
      </div>

      {Content && value.descriptor ? (
        <Content
          disabled={disabled}
          descriptor={value.descriptor}
          onDescriptorChanged={(descriptor) => {
            onValueChanged({ ...value, descriptor });
          }}
        />
      ) : null}
    </div>
  );
}
