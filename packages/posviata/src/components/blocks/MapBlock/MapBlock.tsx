import { BlockHeader } from '@/components/BlockHeader';
import { MapSelector } from '@/components/MapSelector';

import { BlockContainer } from '../BlockContainer';
import styles from './MapBlock.module.scss';

export function MapBlock() {
  return (
    <BlockContainer id="Карта" className={styles.root}>
      <BlockHeader className={styles.header}>Карта</BlockHeader>

      <MapSelector className={styles.map} />
    </BlockContainer>
  );
}
