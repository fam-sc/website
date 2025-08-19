import { BlockHeader } from '@/components/BlockHeader';

import { BlockContainer } from '../BlockContainer';
import styles from './QuestionBlock.module.scss';

export function QuestionBlock() {
  return (
    <BlockContainer className={styles.root}>
      <BlockHeader className={styles.header}>Є питання?</BlockHeader>

      <a href="https://t.me/fpm_sc_bot" className={styles.button}>
        Пиши сюди
      </a>
    </BlockContainer>
  );
}
