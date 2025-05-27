'use client';

import { useState } from 'react';
import Logo from '@public/images/logo.png';
import Image from 'next/image';

import { IconButton } from '../IconButton';
import { Link } from '../Link';
import { LinkButton } from '../LinkButton';

import styles from './index.module.scss';

import { useScrollbar } from '@/hooks/useScrollbar';
import { CloseIcon } from '@/icons/CloseIcon';
import { MenuIcon } from '@/icons/MenuIcon';

export type HeaderProps = {
  userLogOn: boolean;
};

const items: { title: string; href: string }[] = [
  { title: 'Студентство', href: '/students' },
  { title: 'Розклад', href: '/schedule' },
  { title: 'Опитування', href: '#' },
];

function Navigation() {
  return (
    <ul className={styles.nav}>
      {items.map(({ title, href }) => (
        <li key={`${href}-${title}`}>
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
      <LinkButton href="/sign?mode=signin" buttonVariant="solid">
        Увійти
      </LinkButton>

      <LinkButton href="/sign?mode=signup" buttonVariant="outlined">
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
      <div
        className={styles.content}
        onClick={({ target }) => {
          // Hide mobile menu if the user navigated to another page - the mobile menu
          // is no longer relevant.
          if (target instanceof HTMLElement && target.nodeName === 'a') {
            setMobileMenuOpen(false);
          }
        }}
      >
        <Link href="/" className={styles.logo}>
          <Image src={Logo} alt="Logo" />
        </Link>

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
      </div>
    </header>
  );
}
