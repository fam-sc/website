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

export function googleIcon(pathData: string): FC<SvgProps> {
  // eslint-disable-next-line react/display-name
  return (rest) => {
    return (
      <svg viewBox="0 -960 960 960" fill="#fff" {...rest}>
        <path d={pathData} />
      </svg>
    );
  };
}
