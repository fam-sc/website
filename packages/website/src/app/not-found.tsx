import { LinkButton } from '@/components/LinkButton';
import { Typography } from '@/components/Typography';

import styles from './not-found.module.scss';

export default function NotFoundPage() {
  return (
    <div className={styles.content}>
      <Typography variant="h3">Нема</Typography>
      <Typography variant="bodyLarge">Схоже такої сторінки немає...</Typography>
      <LinkButton href="/" buttonVariant="solid">
        На головну
      </LinkButton>
    </div>
  );
}
