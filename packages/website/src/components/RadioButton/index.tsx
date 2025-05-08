import { classNames } from '@/utils/classNames';

import styles from './index.module.scss';
import { OptionBase, OptionBaseProps } from '../OptionBase';

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
