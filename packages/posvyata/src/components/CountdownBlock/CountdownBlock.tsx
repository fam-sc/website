import { AnimatedText } from '../AnimatedText';
import { BlockContainer } from '../BlockContainer';
import styles from './CountdownBlock.module.scss';

export function CountdownBlock() {
  return (
    <BlockContainer className={styles.root}>
      <AnimatedText text="12:34:66" className={styles.countdown} />
    </BlockContainer>
  );
}
