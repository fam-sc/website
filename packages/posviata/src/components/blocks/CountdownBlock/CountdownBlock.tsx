import { PixelUnderlineButton } from '../../PixelUnderlineButton';
import { BlockContainer } from '../BlockContainer';
import { Countdown } from './components/Countdown';
import { Header } from './components/Header';
import styles from './CountdownBlock.module.scss';

export function CountdownBlock() {
  return (
    <BlockContainer id="Відлік" className={styles.root}>
      <div className={styles.content}>
        <Header className={styles.header} />
        <p className={styles.year}>2025</p>
        <Countdown className={styles.countdown} />
        <PixelUnderlineButton className={styles['form-button']}>
          Заповнити форму
        </PixelUnderlineButton>
      </div>
    </BlockContainer>
  );
}
