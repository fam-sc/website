import { ComponentProps } from 'react';

import { postUserClickedRegistration } from '@/api/client';
import { RegistrationClickPlace } from '@/campaign/types';

import { LinkButton } from '../LinkButton';

interface RegistrationButtonProps extends Omit<ComponentProps<'a'>, 'href'> {
  place: RegistrationClickPlace;
}

export function RegistrationButton({
  place,
  ...rest
}: RegistrationButtonProps) {
  return (
    <LinkButton
      href="https://google.com"
      onClick={() => {
        void postUserClickedRegistration(place);
      }}
      {...rest}
    />
  );
}
