import { Dispatch, SetStateAction, useCallback, useRef } from 'react';

import { PlusIcon } from '@/icons/PlusIcon';
import { classNames } from '@/utils/classNames';

import { DraggableList } from '../DraggableList';
import { IconButton } from '../IconButton';
import { PollQuestionBuilder } from '../PollQuestionBuilder';
import { isValidItem, QuestionBuildItem } from '../PollQuestionBuilder/item';
import styles from './index.module.scss';

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

  return (
    <div className={classNames(styles.root, className)}>
      {items.length > 0 && (
        <DraggableList
          className={styles.items}
          items={items}
          onItemsChanged={onItemsChanged}
        >
          {(item, i, handleRef) => (
            <PollQuestionBuilder
              value={item}
              disabled={disabled}
              isError={!isValidItem(item)}
              handleRef={handleRef}
              onRemove={() => {
                const copy = [...items];
                copy.splice(i, 1);

                onItemsChanged(copy);
              }}
              onValueChanged={(value) => {
                const copy = [...items];
                copy[i] = value;

                onItemsChanged(copy);
              }}
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
