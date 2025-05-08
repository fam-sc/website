import { classNames } from '@/utils/classNames';
import { PollQuestionBuilder } from '../PollQuestionBuilder';

import styles from './index.module.scss';
import { IconButton } from '../IconButton';
import { PlusIcon } from '@/icons/PlusIcon';
import { isValidItem, QuestionBuildItem } from '../PollQuestionBuilder/item';

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
      <ul className={styles.items}>
        {items.map((item, i) => (
          <li key={i}>
            <PollQuestionBuilder
              value={item}
              disabled={disabled}
              isError={!isValidItem(item)}
              onValueChanged={(value) => {
                const copy = [...items];
                copy[i] = value;

                onItemsChanged(copy);
              }}
            />
          </li>
        ))}
      </ul>

      <IconButton
        disabled={disabled}
        className={styles.add}
        onClick={() => {
          onItemsChanged([...items, { title: '' }]);
        }}
      >
        <PlusIcon />
      </IconButton>
    </div>
  );
}
