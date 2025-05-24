import { classNames } from '@/utils/classNames';
import styles from './index.module.scss';
import { Typography } from '../Typography';
import { ExclamationIcon } from '@/icons/ExclamationIcon';

export type ErrorBoardProps = {
  className?: string;
  items: (string | undefined | false)[];
};

export function ErrorBoard({ className, items }: ErrorBoardProps) {
  const notEmptyItems = items.filter((x): x is string => !!x);
  if (notEmptyItems.length === 0) {
    return undefined;
  }

  return (
    <ul className={classNames(styles.root, className)}>
      {notEmptyItems.map((item) => (
        <li key={item}>
          <ExclamationIcon aria-hidden />
          <Typography>{item}</Typography>
        </li>
      ))}
    </ul>
  );
}
