import { Title } from '@/components/Title';

import PageContent from './content.md?react';
import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.root}>
      <Title>Політика конфіденційності</Title>

      <PageContent />
    </div>
  );
}
