import { FC, RefObject, useCallback } from 'react';

import { CloseIcon } from '@/icons/CloseIcon';
import { QuestionBuildItem } from '@/services/polls/buildItem';
import {
  QuestionDescriptor,
  QuestionDescriptorContent,
  QuestionType,
} from '@/services/polls/types';
import { classNames } from '@/utils/classNames';

import { DragHandle } from '../DragHandle';
import { IconButton } from '../IconButton';
import { Select } from '../Select';
import { TextInput } from '../TextInput';
import {
  CheckboxContent,
  MultiCheckboxContent,
  RadioContent,
  ScoreContent,
} from './content';
import { ContentTypeProps } from './content/types';
import styles from './PollQuestionBuilder.module.scss';

export type PollQuestionBuilderProps = {
  className?: string;
  disabled?: boolean;

  handleRef?: RefObject<HTMLButtonElement | null>;

  isError?: boolean;
  value: QuestionBuildItem;
  onValueChanged: (
    changes: Partial<QuestionBuildItem>,
    key: string | number
  ) => void;
  onRemove: (key: string | number) => void;
};

type ContentConfig<T extends QuestionType> = {
  title: string;
  emptyDescriptor: QuestionDescriptorContent<T>;
  component?: FC<ContentTypeProps<T>>;
};

type ContentConfigMap = {
  [T in QuestionType]: ContentConfig<T>;
};

const contentConfig: ContentConfigMap = {
  text: {
    title: 'Текст',
    emptyDescriptor: {},
  },
  checkbox: {
    title: 'Прапорець',
    emptyDescriptor: { requiredTrue: false },
    component: CheckboxContent,
  },
  multicheckbox: {
    title: 'Вибір (багато варіантів)',
    emptyDescriptor: { options: [] },
    component: MultiCheckboxContent,
  },
  radio: {
    title: 'Вибір (один варіант)',
    emptyDescriptor: { options: [] },
    component: RadioContent,
  },
  score: {
    title: 'Оцінка',
    emptyDescriptor: { items: [] },
    component: ScoreContent,
  },
};

function createDescriptorFromContent<T extends QuestionType>(
  type: T,
  content: QuestionDescriptorContent<T>
): QuestionDescriptor<T> {
  return { type, ...content };
}

function createEmptyDescriptor<T extends QuestionType>(
  type: T
): QuestionDescriptor<T> {
  return createDescriptorFromContent(type, contentConfig[type].emptyDescriptor);
}

const contentTypeItems = Object.entries(contentConfig).map(
  ([key, { title }]) => ({
    key: key as QuestionType,
    title,
  })
);

export function PollQuestionBuilder({
  className,
  disabled,
  handleRef,
  isError,
  value,
  onValueChanged,
  onRemove,
}: PollQuestionBuilderProps) {
  const { key, descriptor } = value;
  const type = descriptor?.type;
  const config = type ? contentConfig[type] : null;

  const Content = config?.component as
    | FC<ContentTypeProps<QuestionType>>
    | undefined;

  const keyedOnValueChanged = useCallback(
    (changes: Partial<QuestionBuildItem>) => onValueChanged(changes, key),
    [key, onValueChanged]
  );

  const onTitleChanged = useCallback(
    (title: string) => keyedOnValueChanged({ title }),
    [keyedOnValueChanged]
  );

  const onTypeChanged = useCallback(
    (type: QuestionType) => {
      keyedOnValueChanged({
        descriptor: createEmptyDescriptor(type),
      });
    },
    [keyedOnValueChanged]
  );

  const onDescriptorChanged = useCallback(
    (content: QuestionDescriptorContent) => {
      if (type) {
        keyedOnValueChanged({
          descriptor: createDescriptorFromContent(type, content),
        });
      }
    },
    [type, keyedOnValueChanged]
  );

  const onRemoveClick = useCallback(() => onRemove(key), [key, onRemove]);

  return (
    <div
      className={classNames(
        styles.root,
        isError && styles[`root-error`],
        className
      )}
    >
      <div className={styles['top-header']}>
        {handleRef && <DragHandle ref={handleRef} />}

        <IconButton
          onClick={onRemoveClick}
          title="Видалити питання"
          className={styles.remove}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className={styles.header}>
        <TextInput
          variant="underline"
          className={styles.title}
          value={value.title}
          placeholder="Питання"
          disabled={disabled}
          onTextChanged={onTitleChanged}
        />

        <Select
          className={styles['type-select']}
          placeholder="Виберіть тип"
          selectedItem={type}
          disabled={disabled}
          items={contentTypeItems}
          onItemSelected={onTypeChanged}
        />
      </div>

      {Content && descriptor && (
        <div className={styles['content-wrapper']}>
          <Content
            disabled={disabled}
            descriptor={descriptor}
            onDescriptorChanged={onDescriptorChanged}
          />
        </div>
      )}
    </div>
  );
}
