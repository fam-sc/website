import { PastMediaEntry } from '@/api/pastMedia/types';
import { PastMediaEntryType } from '@/data/types';

import { PastMediaImage } from '../PastMediaImage';
import { PastMediaVideo } from '../PastMediaVideo';
import styles from './PastMediaItem.module.scss';

export interface PastMediaItemProps {
  item: PastMediaEntry;
  onClick: () => void;
}

export function PastMediaItem({ item, onClick }: PastMediaItemProps) {
  return (
    <div className={styles.root} onClick={onClick}>
      {item.type === PastMediaEntryType.IMAGE ? (
        <PastMediaImage
          sources={item.alternative}
          sizes={{ 900: '30vw', default: '50vw' }}
        />
      ) : (
        <PastMediaVideo path={item.path} thumbnail={item.thumbnail} />
      )}
    </div>
  );
}
