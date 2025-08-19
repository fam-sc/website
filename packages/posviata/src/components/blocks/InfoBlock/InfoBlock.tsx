import { BlockContainer } from '../BlockContainer';
import { Header } from './components/Header';
import { Info } from './components/Info';
import styles from './InfoBlock.module.scss';

export function InfoBlock() {
  return (
    <BlockContainer className={styles.root}>
      <Header />
      <Info className={styles.info} />
    </BlockContainer>
  );
}
