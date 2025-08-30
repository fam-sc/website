import { classNames } from '@sc-fam/shared';

import styles from './PastMediaImage.module.scss';

export interface PastMediaImageProps {
  className?: string;
  path: string;
}

export function PastMediaImage({ className, path }: PastMediaImageProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <img loading="lazy" src={path} />
    </div>
  );
}
