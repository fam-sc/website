import { FC } from 'react';

import { classNames } from '@/utils/classNames';

import { Checkbox } from '../Checkbox';
import { OptionListBuilder } from '../OptionListBuilder';
import { QuestionDescriptor, QuestionType } from '../PollQuestion/types';
import { Select } from '../Select';
import { TextInput } from '../TextInput';
import styles from './index.module.scss';
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
        items={descriptor.options.map(({ title }) => title)}
        onItemsChanged={(items) => {
          onDescriptorChanged({
            type,
            options: items.map((title, id) => ({ id, title })),
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
      return { type, options: [] };
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
    <div
      className={classNames(
        styles.root,
        isError && styles[`root-error`],
        className
      )}
    >
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
