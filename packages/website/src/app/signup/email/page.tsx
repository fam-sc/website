import { Typography } from '@/components/Typography';

import styles from './page.module.scss';

export default function Page() {
  return (
    <div>
      <Typography className={styles.title} variant="h3">
        Майже все...
      </Typography>

      <Typography className={styles.subtitle} variant="bodyLarge">
        На вашу електронну пошту був відправлений лист. Перейдіть за посиланням,
        щоб закінчити реєстрацію
      </Typography>
    </div>
  );
}
