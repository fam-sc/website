import { Link } from 'react-router';

import { ImpersonatedProps } from '@/utils/impersonation';

import {
  IconComponentBase,
  IconComponentBaseProps,
} from '../IconComponentBase';

type IconLinkButtonProps = Omit<
  ImpersonatedProps<IconComponentBaseProps, typeof Link>,
  'as'
>;

export function IconLinkButton({ to, ...rest }: IconLinkButtonProps) {
  return <IconComponentBase<typeof Link> as={Link} to={to} {...rest} />;
}
