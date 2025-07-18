import { PlusIcon } from '@/icons/PlusIcon';
import { classNames } from '@/utils/classNames';

import { IconButton } from '../IconButton';
import { PollQuestionBuilder } from '../PollQuestionBuilder';
import { isValidItem, QuestionBuildItem } from '../PollQuestionBuilder/item';
import styles from './index.module.scss';

export type PollBuilderProps = {
  className?: string;
  disabled?: boolean;

  items: QuestionBuildItem[];
  onItemsChanged: (items: QuestionBuildItem[]) => void;
};

export function PollBuilder({
  className,
  disabled,
  items,
  onItemsChanged,
}: PollBuilderProps) {
  return (
    <div className={classNames(styles.root, className)}>
      {items.length > 0 && (
        <ul className={styles.items}>
          {items.map((item, i) => (
            <li key={i}>
              <PollQuestionBuilder
                value={item}
                disabled={disabled}
                isError={!isValidItem(item)}
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
            </li>
          ))}
        </ul>
      )}

      <IconButton
        disabled={disabled}
        className={styles.add}
        title="Додати питання"
        onClick={() => {
          onItemsChanged([...items, { title: '' }]);
        }}
      >
        <PlusIcon />
      </IconButton>
    </div>
  );
}
