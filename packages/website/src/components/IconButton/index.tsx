import { ImpersonatedProps } from '@/utils/impersonation';

import {
  IconComponentBase,
  IconComponentBaseProps,
} from '../IconComponentBase';

type IconButtonProps = Omit<
  ImpersonatedProps<IconComponentBaseProps, 'button'>,
  'as'
>;

export function IconButton(props: IconButtonProps) {
  return <IconComponentBase as="button" {...props} />;
}
