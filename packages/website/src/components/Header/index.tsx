import { useState } from 'react';
import Logo from '@/images/logo.png?w=100!';

import { IconButton } from '../IconButton';
import { Link } from '../Link';
import { LinkButton } from '../LinkButton';

import styles from './index.module.scss';

import { useScrollbar } from '@/hooks/useScrollbar';
import { CloseIcon } from '@/icons/CloseIcon';
import { MenuIcon } from '@/icons/MenuIcon';
import { useAuthInfo } from '@/auth/context';
import { getMediaFileUrl } from '@/api/media';
import { navigationMainRoutes } from '@/constants/navigation';
import { UserAvatarOrPlaceholder } from '../UserAvatarOrPlaceholder';

function Navigation() {
  return (
    <ul className={styles.nav}>
      {navigationMainRoutes.map(({ title, href }) => (
        <li key={`${href}-${title}`}>
          <Link linkVariant="clean" to={href}>
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
      <LinkButton to="/sign?mode=signin" buttonVariant="solid">
        Увійти
      </LinkButton>

      <LinkButton to="/sign?mode=signup" buttonVariant="outlined">
        Зареєструватись
      </LinkButton>
    </div>
  );
}

type AvatarProps = {
  userId: number;
  hasAvatar: boolean | undefined;
};

function Avatar({ userId, hasAvatar }: AvatarProps) {
  return (
    <Link className={styles.avatar} to="/u/info">
      <UserAvatarOrPlaceholder
        src={hasAvatar ? getMediaFileUrl(`user/${userId}`) : undefined}
      />
    </Link>
  );
}

function AvatarOrButtons() {
  const { user } = useAuthInfo();

  return user === null ? (
    <Buttons />
  ) : (
    <Avatar userId={user.id} hasAvatar={user.hasAvatar} />
  );
}

function MobileMenu() {
  return (
    <div className={styles['mobile-menu']}>
      <Navigation />

      <AvatarOrButtons />
    </div>
  );
}

export function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useScrollbar(!isMobileMenuOpen);

  return (
    <header className={styles.root}>
      <div
        className={styles.content}
        onClick={({ target }) => {
          // Hide mobile menu if the user navigated to another page - the mobile menu
          // is no longer relevant.
          if (target instanceof HTMLElement && target.nodeName === 'A') {
            setMobileMenuOpen(false);
          }
        }}
      >
        <Link to="/" className={styles.logo} aria-hidden>
          <img src={Logo} alt="Logo" />
        </Link>

        <Navigation />
        <AvatarOrButtons />

        <IconButton
          className={styles['menu-button']}
          onClick={() => {
            setMobileMenuOpen((state) => !state);
          }}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {isMobileMenuOpen && <MobileMenu />}
      </div>
    </header>
  );
}
