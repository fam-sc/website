import { BlockContainer } from '../BlockContainer';
import styles from './QuestionBlock.module.scss';

export function QuestionBlock() {
  return (
    <BlockContainer className={styles.root}>
      <h2 className={styles.header}>Є питання?</h2>

      <a href="https://t.me/fpm_sc_bot" className={styles.button}>
        Пиши сюди
      </a>
    </BlockContainer>
  );
}
