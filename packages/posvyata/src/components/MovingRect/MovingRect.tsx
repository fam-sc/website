import { SvgProps } from '@/icons/types';

import { MovingPath } from '../MovingPath';

export type MovingRectProps = Omit<SvgProps, 'viewBox'>;

export function MovingRect(props: MovingRectProps) {
  return (
    <MovingPath
      viewBox="0 0 1 1"
      data="M 0 0 L 1 0 L 1 1 L 0 1 Z"
      preserveAspectRatio="none"
      strokeLinecap="round"
      {...props}
    />
  );
}
