import { classNames } from '@/utils/classNames';

import { OptionBase, OptionBaseProps } from '../OptionBase';
import styles from './RadioButton.module.scss';

export function RadioButton({
  className,
  ...rest
}: Omit<OptionBaseProps, 'type'>) {
  return (
    <OptionBase
      className={classNames(styles.root, className)}
      {...rest}
      type="radio"
    />
  );
}
