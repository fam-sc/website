import { Title } from '@/components/Title';
import { Typography } from '@/components/Typography';

import styles from './page.module.scss';

export default function NotFoundPage() {
  return (
    <div className={styles.content}>
      <Title>Cторінку не знайдено</Title>

      <Typography variant="h2">Нема</Typography>
      <Typography variant="bodyLarge">Схоже такої сторінки немає...</Typography>
    </div>
  );
}
