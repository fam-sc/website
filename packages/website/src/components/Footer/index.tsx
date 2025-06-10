import { Link } from '../Link';
import { Typography } from '../Typography';

import styles from './index.module.scss';

import { classNames } from '@/utils/classNames';
import { navigationMainRoutes } from '@/constants/navigation';

export interface FooterProps {
  className?: string;
}

const items: { title: string; href: string }[] = [
  { title: 'Головна', href: '/home' },
  ...navigationMainRoutes,
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
          <Link key={item.href} to={item.href}>
            <Typography>{item.title}</Typography>
          </Link>
        ))}{' '}
      </div>

      <div className={styles.section}>
        <Typography as="strong">Підтримка</Typography>

        <div className={styles.linkWithIcon}>
          <img src="/icons/Question.svg" width={15} height={15} alt="Bot" />

          <Link to="https://t.me/fpm_sc_bot">Чат-бот</Link>
        </div>

        <div className={styles.linkWithIcon}>
          <img src="/icons/Logo.svg" width={15} height={15} alt="Bot" />
          <Link to="/home">Про нас</Link>
        </div>
      </div>

      <div className={styles.section}>
        <Link to="/privacy-policy">
          <Typography as="strong">Політика конфіденційності</Typography>
        </Link>
      </div>

      <div className={styles.icons}>
        <a href="mailto:sr.fam.kpi@gmail.com" aria-label="Email">
          <img src="/icons/Mail.svg" width={24} height={24} alt="Mail" />
        </a>

        <Link to="https://www.instagram.com/fam_kpi/">
          <img
            src="/icons/Instagram.svg"
            width={24}
            height={24}
            alt="Instagram"
          />
        </Link>
        <Link to="https://t.me/primat_kpi">
          <img
            src="/icons/Telegram.svg"
            width={24}
            height={24}
            alt="Telegram"
          />
        </Link>
        <Link to="https://www.tiktok.com/@fam_kpi?_t=ZM-8vrGKJSe9Rt&_r=1">
          <img src="/icons/TikTok.svg" width={24} height={24} alt="TikTok" />
        </Link>
      </div>
    </footer>
  );
}
