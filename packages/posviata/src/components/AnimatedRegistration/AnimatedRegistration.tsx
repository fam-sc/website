import { RegistrationClickPlace } from '@/campaign/types';
import { classNames } from '@/utils/classNames';

import { AnimatedRegistrationPattern } from '../AnimatedRegistrationPattern';
import { RegistrationButton } from '../RegistrationButton';
import styles from './AnimatedRegistration.module.scss';

export interface AnimatedRegistrationProps {
  className?: string;
}

export function AnimatedRegistration({ className }: AnimatedRegistrationProps) {
  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.content}>
        <AnimatedRegistrationPattern className={styles.pattern} />

        <RegistrationButton
          className={styles.register}
          place={RegistrationClickPlace.FOOTER}
        >
          Реєстрація
        </RegistrationButton>
      </div>
    </div>
  );
}
