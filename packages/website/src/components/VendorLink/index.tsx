import { PropsMap } from '@/types/react';
import { Link, LinkProps } from '../Link';
import { detectLinkVendor } from '@/utils/linkVendor';
import { useMemo } from 'react';
import { ZoomIcon } from '@/icons/ZoomIcon';

type AnchorProps = PropsMap['a'];

export interface VendorLinkProps extends LinkProps, Omit<AnchorProps, 'href'> {}

export function VendorLink({ href, children, ...rest }: VendorLinkProps) {
  const vendor = useMemo(() => detectLinkVendor(href), [href]);

  return (
    <Link href={href} hasIcon={vendor !== undefined} {...rest}>
      {vendor === 'zoom' ? <ZoomIcon /> : null}
      {children}
    </Link>
  );
}
