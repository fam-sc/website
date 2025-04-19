import { useState } from 'react';
import Image from 'next/image';

import { IconButton } from '../IconButton';
import { Link } from '../Link';
import { LinkButton } from '../LinkButton';

import styles from './index.module.scss';

import Logo from '@/../public/images/logo.png';
import { useScrollbar } from '@/hooks/useScrollbar';
import { CloseIcon } from '@/icons/CloseIcon';
import { MenuIcon } from '@/icons/MenuIcon';

export type HeaderProps = {
  userLogOn: boolean;
};

type ItemProps = {
  title: string;
  href: string;
};

const items: ItemProps[] = [
  { title: 'Студрада ФПМ', href: '#' },
  { title: 'Розклад', href: '#' },
  { title: 'Опитування', href: '#' },
];

function Navigation() {
  return (
    <ul className={styles.nav}>
      {items.map(({ title, href }) => (
        <li key={href}>
          <Link linkVariant="clean" href={href}>
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Buttons() {
  return (
    <div className={styles.buttons}>
      <LinkButton href="#" variant="solid">
        Увійти
      </LinkButton>

      <LinkButton href="#" variant="outlined" className={styles['sign-up']}>
        Зареєструватись
      </LinkButton>
    </div>
  );
}

function Avatar() {
  return (
    <Image
      className={styles.avatar}
      src="https://i.imgur.com/xxCgHWM.png"
      alt=""
      width={512}
      height={512}
    />
  );
}

function MobileMenu({ userLogOn }: HeaderProps) {
  return (
    <div className={styles['mobile-menu']}>
      <Navigation />

      {userLogOn ? <Avatar /> : <Buttons />}
    </div>
  );
}

export function Header({ userLogOn }: HeaderProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useScrollbar(!isMobileMenuOpen);

  return (
    <header className={styles.root}>
      <Image src={Logo} alt="Logo" className={styles.logo} />

      <Navigation />
      {userLogOn ? <Avatar /> : <Buttons />}

      <IconButton
        className={styles['menu-button']}
        onClick={() => {
          setMobileMenuOpen((state) => !state);
        }}
      >
        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {isMobileMenuOpen && <MobileMenu userLogOn={userLogOn} />}
    </header>
  );
}
