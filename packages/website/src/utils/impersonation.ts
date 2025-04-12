// TODO: Refactor

import { FunctionComponent, ReactElement, ReactNode } from 'react';

import { PropsMap, PropsOf } from '@/types/react';

type Name = keyof PropsMap;

type PartialProperty<T, K extends keyof T> = Omit<T, K> & {
  [K2 in K]?: T[K2];
};

type BaseImpersonated<Base, As = Name | FunctionComponent> = Base & {
  className?: string;
  children?: ReactNode;
  as: As;
};

export type ImpersonatedProps<Base, As extends Name> = BaseImpersonated<
  Base,
  As
> &
  PropsMap[As];

export type ImpersonatedFunctionalProps<Base, As> = BaseImpersonated<Base, As> &
  PropsOf<As>;

export type ImpersonatedComponent<Base, Default extends Name> = {
  <As extends Name>(props: ImpersonatedProps<Base, As>): ReactElement;
  <As>(props: ImpersonatedFunctionalProps<Base, As>): ReactElement;
  (props: Base & PropsMap[Default]): ReactElement;
};

export function impersonatedComponent<Base, Default extends Name>(
  defaultAs: Default,
  factory: (props: BaseImpersonated<Base>) => ReactElement
): ImpersonatedComponent<Base, Default> {
  const result: (
    props: PartialProperty<BaseImpersonated<Base>, 'as'>
  ) => ReactElement = ({ as: _as, ...rest }) => {
    return factory({ as: _as ?? defaultAs, ...rest } as BaseImpersonated<Base>);
  };

  return result as ImpersonatedComponent<Base, Default>;
}
