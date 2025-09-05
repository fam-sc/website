import { BlockHeader } from '@/components/BlockHeader';
import { LinkButton } from '@/components/LinkButton';

import { BlockContainer } from '../BlockContainer';
import styles from './PastBlock.module.scss';

const years = [2023, 2024];

export function PastBlock() {
  return (
    <BlockContainer className={styles.root}>
      <BlockHeader className={styles.header}>ЯК ЦЕ БУЛО</BlockHeader>

      <div className={styles.row}>
        {years.map((year) => (
          <LinkButton key={year} to={`/${year}`}>
            {year}
          </LinkButton>
        ))}
      </div>
    </BlockContainer>
  );
}
