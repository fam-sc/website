import { OptionBase, OptionBaseProps } from '../OptionBase';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

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
