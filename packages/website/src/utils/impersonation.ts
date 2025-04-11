import { PropsMap } from '@/types/react';

type Name = keyof PropsMap;

export type ImpersonatedProps<Base, As extends Name> = Base &
  PropsMap[As] & {
    as?: As;
  };
