import { Typography } from '@/components/Typography';

import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.content}>
      <Typography variant="h4">Майже все...</Typography>

      <Typography variant="bodyLarge" className={styles.subText}>
        Відкрийте посилання, яке прийшло на вашу електронну пошту
      </Typography>
    </div>
  );
}
