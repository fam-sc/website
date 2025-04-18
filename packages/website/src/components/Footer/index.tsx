import Image from 'next/image';

import { Link } from '../Link';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={classNames(styles.root, className)}>
      <div className={styles.section}>
        <Typography as="div">Баранівська Валерія</Typography>
        <Typography as="div">Хмарук Олег</Typography>
        <Typography as="div">2025</Typography>
      </div>

      <div className={styles.section}>
        <Typography as="strong">Головна</Typography>
        <Typography as="strong">Студентство</Typography>
        <Typography as="strong">Розклад</Typography>
        <Typography as="strong">Опитування</Typography>
      </div>

      <div className={styles.section}>
        <Typography as="strong">Підтримка</Typography>
        <Link href="#">Чат-бот</Link>
        <Link href="#">Про нас</Link>
        <Link href="#">FAQ</Link>
      </div>

      <div className={styles.section}>
        <Typography as="strong">Політика конфіденційності</Typography>
        <div className={styles.icons}>
          <Link href="#">
            <Image src="/icons/Mail.svg" width={24} height={24} alt="Mail" />
          </Link>
          <Link href="#">
            <Image
              src="/icons/Instagram.svg"
              width={24}
              height={24}
              alt="Instagram"
            />
          </Link>
          <Link href="#">
            <Image
              src="/icons/Telegram.svg"
              width={24}
              height={24}
              alt="Telegram"
            />
          </Link>
          <Link href="#">
            <Image
              src="/icons/TikTok.svg"
              width={24}
              height={24}
              alt="TikTok"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
