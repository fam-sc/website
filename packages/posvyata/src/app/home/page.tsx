import { CountdownBlock } from '@/components/blocks/CountdownBlock';
import { MathBlock } from '@/components/blocks/MathBlock';
import { VSCodeBlock } from '@/components/blocks/VSCodeBlock';

import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.content}>
      <CountdownBlock />
      <MathBlock />
      <VSCodeBlock />
    </div>
  );
}
