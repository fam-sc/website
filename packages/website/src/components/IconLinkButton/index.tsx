import { Link } from 'react-router';
import {
  IconComponentBase,
  IconComponentBaseProps,
} from '../IconComponentBase';
import { ImpersonatedProps } from '@/utils/impersonation';

type IconLinkButtonProps = Omit<
  ImpersonatedProps<IconComponentBaseProps, typeof Link>,
  'as'
>;

export function IconLinkButton({ to, ...rest }: IconLinkButtonProps) {
  return <IconComponentBase<typeof Link> as={Link} to={to} {...rest} />;
}
