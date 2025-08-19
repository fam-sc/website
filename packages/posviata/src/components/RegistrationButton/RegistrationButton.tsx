import { ComponentProps } from 'react';

import { postUserClickedRegistration } from '@/api/client';
import { RegistrationClickPlace } from '@/campaign/types';
import { classNames } from '@/utils/classNames';

import styles from './RegistrationButton.module.scss';

interface RegistrationButtonProps extends Omit<ComponentProps<'a'>, 'href'> {
  place: RegistrationClickPlace;
}

export function RegistrationButton({
  className,
  place,
  ...rest
}: RegistrationButtonProps) {
  return (
    <a
      href="https://google.com"
      className={classNames(styles.root, className)}
      onClick={() => {
        void postUserClickedRegistration(place);
      }}
      {...rest}
    />
  );
}
