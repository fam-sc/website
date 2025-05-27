import Link from 'next/link';
import {
  IconComponentBase,
  IconComponentBaseProps,
} from '../IconComponentBase';
import { ImpersonatedProps } from '@/utils/impersonation';

type IconLinkButtonProps = Omit<
  ImpersonatedProps<IconComponentBaseProps, typeof Link>,
  'as'
>;

export function IconLinkButton({ href, ...rest }: IconLinkButtonProps) {
  return <IconComponentBase<typeof Link> as={Link} href={href} {...rest} />;
}
