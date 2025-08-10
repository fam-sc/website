import { CountdownBlock } from '@/components/CountdownBlock';

import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.content}>
      <CountdownBlock />
    </div>
  );
}
