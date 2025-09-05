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
      to="https://docs.google.com/forms/d/e/1FAIpQLScq3Bg7HVgADeKTkfOK7HdBDfwwLneAxGKVZTXO39IX93yaKw/viewform"
      onClick={() => {
        void postUserClickedRegistration(place);
      }}
      {...rest}
    />
  );
}
