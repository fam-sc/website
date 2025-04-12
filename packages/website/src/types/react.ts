import { JSX } from 'react';

export type PropsMap = JSX.IntrinsicElements;

export type PropsOf<T> = T extends (props: infer Props) => unknown
  ? Props
  : never;
