import { classNames } from '@/utils/classNames';
import { QuestionDescriptor, QuestionType } from '../PollQuestion/types';

import styles from './index.module.scss';
import { TextInput } from '../TextInput';
import { Select } from '../Select';
import { FC } from 'react';
import { OptionListBuilder } from '../OptionListBuilder';
import { QuestionBuildItem } from './item';

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

const questionTypes: QuestionType[] = ['text', 'radio', 'checkbox'];
const questionTypeTitles: Record<QuestionType, string> = {
  text: 'Текст',
  checkbox: 'Вибір (багато варіантів)',
  radio: 'Вибір (один варіант)',
};

function optionListBuilderWrapper<T extends 'checkbox' | 'radio'>(type: T) {
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

function getEmptyDescriptor(type: QuestionType): QuestionDescriptor {
  switch (type) {
    case 'text': {
      return { type };
    }
    case 'checkbox':
    case 'radio': {
      return { type, choices: [] };
    }
  }
}

const contentComponentMap: ContentComponentMap = {
  text: () => null,
  checkbox: optionListBuilderWrapper('checkbox'),
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
