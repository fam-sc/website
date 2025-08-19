import { HeartIcon } from '@/icons/HeartIcon';

import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.root}>
      <p className={styles.text}>
        by Студрада ФПМ <HeartIcon />
      </p>
    </footer>
  );
}
