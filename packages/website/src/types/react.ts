import { JSX } from 'react';

export type PropsMap = JSX.IntrinsicElements;

export type WithDataSpace<T extends string> = {
  [K in `data-${T}`]?: never;
};
