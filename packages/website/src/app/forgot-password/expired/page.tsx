import { LinkButton } from '@/components/LinkButton';
import { Typography } from '@/components/Typography';
import styles from './page.module.scss';

export default function Page() {
  return (
    <div className={styles.content}>
      <Typography variant="h5">Недійсне посилання</Typography>

      <LinkButton buttonVariant="solid" to="/">
        На головну
      </LinkButton>
    </div>
  );
}
