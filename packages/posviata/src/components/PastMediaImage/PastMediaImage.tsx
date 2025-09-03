import { classNames } from '@sc-fam/shared';
import { MouseEvent, useMemo } from 'react';

import { ImageSourceMap } from '@/api/pastMedia/types';
import { resolveSizes } from '@/utils/image/sizes';
import { ImageSizes } from '@/utils/image/types';

import styles from './PastMediaImage.module.scss';

export interface PastMediaImageProps {
  className?: string;
  sources: ImageSourceMap;
  onClick?: (event: MouseEvent) => void;
  sizes?: ImageSizes;
  fit?: 'contain' | 'cover';
}

export function PastMediaImage({
  className,
  sources,
  sizes,
  onClick,
  fit = 'cover',
}: PastMediaImageProps) {
  const props = useMemo(() => {
    const entries = Object.entries(sources).map(([key, value]) => ({
      width: Number.parseInt(key),
      source: value,
    }));

    const lastEntry = entries.at(-1);
    if (lastEntry === undefined) {
      throw new Error('sources is empty');
    }

    return {
      src: lastEntry.source,
      srcSet: entries
        .map(({ width, source }) => `${source} ${width}w`)
        .join(','),
    };
  }, [sources]);

  return (
    <div
      className={classNames(styles.root, styles[`root-${fit}`], className)}
      onClick={onClick}
    >
      <img loading="lazy" sizes={resolveSizes(sizes)} {...props} />
    </div>
  );
}
