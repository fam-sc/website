import { classNames } from '@sc-fam/shared';
import { IconButton } from '@sc-fam/shared-ui';
import { Dispatch, SetStateAction, useCallback, useRef } from 'react';

import { PlusIcon } from '@/icons/PlusIcon';
import { isValidItem, QuestionBuildItem } from '@/services/polls/buildItem';

import { DraggableList } from '../DraggableList';
import { PollQuestionBuilder } from '../PollQuestionBuilder';
import styles from './PollBuilder.module.scss';

export type PollBuilderProps = {
  className?: string;
  disabled?: boolean;

  items: QuestionBuildItem[];
  onItemsChanged: Dispatch<SetStateAction<QuestionBuildItem[]>>;
};

export function PollBuilder({
  className,
  disabled,
  items,
  onItemsChanged,
}: PollBuilderProps) {
  const lastItemIndex = useRef(0);

  const onAddItem = useCallback(() => {
    onItemsChanged((items) => [
      ...items,
      { key: lastItemIndex.current++, title: '' },
    ]);
  }, [onItemsChanged]);

  const onRemove = useCallback(
    (key: string | number) => {
      onItemsChanged((items) => items.filter((item) => item.key !== key));
    },
    [onItemsChanged]
  );

  const onItemChanged = useCallback(
    (changes: Partial<QuestionBuildItem>, key: string | number) => {
      onItemsChanged((items) =>
        items.map((item) => (item.key === key ? { ...item, ...changes } : item))
      );
    },
    [onItemsChanged]
  );

  return (
    <div className={classNames(styles.root, className)}>
      {items.length > 0 && (
        <DraggableList
          className={styles.items}
          items={items}
          onItemsChanged={onItemsChanged}
        >
          {(item, _, handleRef) => (
            <PollQuestionBuilder
              key={item.key}
              value={item}
              disabled={disabled}
              isError={!isValidItem(item)}
              handleRef={handleRef}
              onRemove={onRemove}
              onValueChanged={onItemChanged}
            />
          )}
        </DraggableList>
      )}

      <IconButton
        disabled={disabled}
        className={styles.add}
        title="Додати питання"
        onClick={onAddItem}
      >
        <PlusIcon />
      </IconButton>
    </div>
  );
}
