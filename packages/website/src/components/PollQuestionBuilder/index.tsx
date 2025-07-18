import { FC, RefObject } from 'react';

import { CloseIcon } from '@/icons/CloseIcon';
import { classNames } from '@/utils/classNames';

import { DragHandle } from '../DragHandle';
import { IconButton } from '../IconButton';
import { QuestionDescriptor, QuestionType } from '../PollQuestion/types';
import { Select } from '../Select';
import { TextInput } from '../TextInput';
import { CheckboxContent, MultiCheckboxContent, RadioContent } from './content';
import { ContentTypeProps } from './content/types';
import styles from './index.module.scss';
import { QuestionBuildItem } from './item';

export type PollQuestionBuilderProps = {
  className?: string;
  disabled?: boolean;

  handleRef?: RefObject<HTMLButtonElement | null>;

  isError?: boolean;
  value: QuestionBuildItem;
  onValueChanged: (value: QuestionBuildItem) => void;
  onRemove: () => void;
};

type ContentConfig<T extends QuestionType> = {
  title: string;
  emptyDescription: () => QuestionDescriptor<T>;
  component: FC<ContentTypeProps<T>>;
};

type ContentConfigMap = {
  [T in QuestionType]: ContentConfig<T>;
};

const contentConfig: ContentConfigMap = {
  text: {
    title: 'Текст',
    emptyDescription: () => ({ type: 'text' }),
    component: () => null,
  },
  checkbox: {
    title: 'Прапорець',
    emptyDescription: () => ({ type: 'checkbox', requiredTrue: false }),
    component: CheckboxContent,
  },
  multicheckbox: {
    title: 'Вибір (багато варіантів)',
    emptyDescription: () => ({ type: 'multicheckbox', options: [] }),
    component: MultiCheckboxContent,
  },
  radio: {
    title: 'Вибір (один варіант)',
    emptyDescription: () => ({ type: 'radio', options: [] }),
    component: RadioContent,
  },
};

const questionTypes = Object.keys(contentConfig) as QuestionType[];

const contentTypeItems = questionTypes.map((type) => ({
  key: type,
  title: contentConfig[type].title,
}));

export function PollQuestionBuilder({
  className,
  disabled,
  handleRef,
  isError,
  value,
  onValueChanged,
  onRemove,
}: PollQuestionBuilderProps) {
  const { descriptor } = value;
  const config = descriptor ? contentConfig[descriptor.type] : null;

  const Content = config?.component as
    | FC<ContentTypeProps<QuestionType>>
    | undefined;

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
          onClick={onRemove}
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
          onTextChanged={(title) => {
            onValueChanged({ ...value, title });
          }}
        />

        <Select
          className={styles['type-select']}
          placeholder="Виберіть тип"
          selectedItem={descriptor?.type}
          disabled={disabled}
          items={contentTypeItems}
          onItemSelected={(type) => {
            onValueChanged({
              ...value,
              descriptor: contentConfig[type].emptyDescription(),
            });
          }}
        />
      </div>

      {Content && descriptor ? (
        <div className={styles['content-wrapper']}>
          <Content
            disabled={disabled}
            descriptor={descriptor}
            onDescriptorChanged={(descriptor) => {
              onValueChanged({ ...value, descriptor });
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
