import { FC, JSX, ReactNode } from 'react';

type Element<T = Record<string, never>> = FC<T> | keyof JSX.IntrinsicElements;

export type MarkdownConfig = {
  paragraph: Element<{ children: ReactNode }>;
  listItem: Element<{ children: ReactNode }>;
  header: Element<{ level: 1 | 2 | 3 | 4 | 5 | 6; children: ReactNode }>;
  anchor: Element<{ href: string; children: ReactNode }>;
};
