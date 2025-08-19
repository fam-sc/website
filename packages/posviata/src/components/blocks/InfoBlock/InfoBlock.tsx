import { BlockHeader } from '@/components/BlockHeader';

import { BlockContainer } from '../BlockContainer';
import { Info } from './components/Info';
import styles from './InfoBlock.module.scss';

export function InfoBlock() {
  return (
    <BlockContainer className={styles.root}>
      <BlockHeader className={styles.header}>ІНФО</BlockHeader>
      <Info className={styles.info} />
    </BlockContainer>
  );
}
