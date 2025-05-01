import Image from 'next/image';

import { Link } from '../Link';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';

export interface FooterProps {
  className?: string;
}

const items: { title: string; href: string }[] = [
  { title: 'Головна', href: '/home' },
  { title: 'Студентство', href: '/students' },
  { title: 'Розклад', href: '/schedule' },
  { title: 'Опитування', href: '#' },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className={classNames(styles.root, className)}>
      <div className={styles.section}>
        <Typography>Баранівська Валерія</Typography>
        <Typography>Хмарук Олег</Typography>
        <Typography>2025</Typography>
      </div>

      <div className={styles.section}>
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <Typography>{item.title}</Typography>
          </Link>
        ))}{' '}
      </div>

      <div className={styles.section}>
        <Typography as="strong">Підтримка</Typography>

        <div className={styles.linkWithIcon}>
          <Image src="/icons/bot.svg" width={15} height={15} alt="Bot" />
          <Link href="https://t.me/fpm_sc_bot">Чат-бот</Link>
        </div>

        <div className={styles.linkWithIcon}>
          <Image src="/icons/Logo.svg" width={15} height={15} alt="Bot" />
          <Link href="#">Про нас</Link>
        </div>

        <div className={styles.linkWithIcon}>
          <Image src="/icons/Question.svg" width={15} height={15} alt="Bot" />
          <Link href="#">FAQ</Link>
        </div>
      </div>

      <div className={styles.section}>
        <Link href="#">
          <Typography as="strong">Політика конфіденційності</Typography>
        </Link>

        <div className={styles.icons}>
          <Link href="malito:sr.fam.kpi@gmail.com" aria-label="Email">
            <Image src="/icons/Mail.svg" width={24} height={24} alt="Mail" />
          </Link>

          <Link href="https://www.instagram.com/fam_kpi/">
            <Image
              src="/icons/Instagram.svg"
              width={24}
              height={24}
              alt="Instagram"
            />
          </Link>
          <Link href="https://t.me/primat_kpi">
            <Image
              src="/icons/Telegram.svg"
              width={24}
              height={24}
              alt="Telegram"
            />
          </Link>
          <Link href="https://www.tiktok.com/@fam_kpi?_t=ZM-8vrGKJSe9Rt&_r=1">
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
