import { FC } from 'react';

import { SvgProps } from './types';

export function defaultIcon(pathData: string, size: number = 24): FC<SvgProps> {
  const viewBox = `0 0 ${size} ${size}`;

  // eslint-disable-next-line react/display-name
  return (rest) => {
    return (
      <svg viewBox={viewBox} {...rest}>
        <path d={pathData} />
      </svg>
    );
  };
}
