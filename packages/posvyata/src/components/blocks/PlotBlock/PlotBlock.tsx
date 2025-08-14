import { BlockContainer } from '../BlockContainer';
import { Header } from './components/Header';
import { Info } from './components/Info';
import styles from './PlotBlock.module.scss';

export function PlotBlock() {
  return (
    <BlockContainer className={styles.root}>
      <Header />
      <Info className={styles.info} />
    </BlockContainer>
  );
}
