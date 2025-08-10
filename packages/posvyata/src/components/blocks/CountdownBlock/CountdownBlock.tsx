import { Button } from '../../Button/Button';
import { BlockContainer } from '../BlockContainer';
import { Countdown } from './components/Countdown';
import { Header } from './components/Header';
import styles from './CountdownBlock.module.scss';

export function CountdownBlock() {
  return (
    <BlockContainer className={styles.root}>
      <div className={styles.content}>
        <Header className={styles.header} />
        <Countdown className={styles.countdown} />
        <Button
          className={styles['form-button']}
          font="press-start"
          hoverEffect="pixel-underline"
        >
          Заповнити форму
        </Button>
      </div>
    </BlockContainer>
  );
}
