import { MapSelector } from '@/components/MapSelector';

import { BlockContainer } from '../BlockContainer';
import styles from './MapBlock.module.scss';

export function MapBlock() {
  return (
    <BlockContainer className={styles.root}>
      <h2 className={styles.header}>Карта</h2>

      <MapSelector className={styles.map} />
    </BlockContainer>
  );
}
