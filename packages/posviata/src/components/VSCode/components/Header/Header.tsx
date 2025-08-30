import { classNames } from '@sc-fam/shared';

import { Image } from '@/components/Image';
import Logo from '@/images/logo.png?w=100!';

import { HeaderProjectNavigation } from '../HeaderProjectNavigation';
import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <Image
        src={Logo}
        alt="Logo"
        width={80}
        height={80}
        className={styles.logo}
      />

      <HeaderProjectNavigation className={styles.navigation} />
    </div>
  );
}
