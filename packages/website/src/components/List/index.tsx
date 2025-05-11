import { PropsMap } from '@/types/react';
import { classNames } from '@/utils/classNames';
import styles from './index.module.scss';

type ListProps = PropsMap['ul'];

export function List({ className, ...rest }: ListProps) {
  return <ul className={classNames(styles.root, className)} {...rest} />;
}
