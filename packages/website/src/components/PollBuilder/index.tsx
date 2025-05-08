import { classNames } from '@/utils/classNames';
import { PollQuestionBuilder, QuestionBuildItem } from '../PollQuestionBuilder';

import styles from './index.module.scss';
import { IconButton } from '../IconButton';
import { PlusIcon } from '@/icons/PlusIcon';

export type PollBuilderProps = {
  className?: string;
  items: QuestionBuildItem[];
  onItemsChanged: (items: QuestionBuildItem[]) => void;
};

function isValidItem({ title, descriptor }: QuestionBuildItem): boolean {
  if (title.length === 0 || descriptor === undefined) {
    return false;
  }

  switch (descriptor.type) {
    case 'checkbox':
    case 'radio': {
      return descriptor.choices.length > 0;
    }
    default: {
      return true;
    }
  }
}

export function PollBuilder({
  className,
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
