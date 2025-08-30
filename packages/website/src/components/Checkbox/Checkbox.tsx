import { classNames } from '@sc-fam/shared';

import { OptionBase, OptionBaseProps } from '../OptionBase';
import styles from './Checkbox.module.scss';

export function Checkbox({
  className,
  ...rest
}: Omit<OptionBaseProps, 'type'>) {
  return (
    <OptionBase
      className={classNames(styles.root, className)}
      {...rest}
      type="checkbox"
    />
  );
}
