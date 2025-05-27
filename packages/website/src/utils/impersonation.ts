// TODO: Refactor

import {
  ComponentProps,
  JSX,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from 'react';

export type ImpersonatedName =
  | keyof JSX.IntrinsicElements
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | JSXElementConstructor<any>;

type PartialProperty<T, K extends keyof T> = Omit<T, K> & {
  [K2 in K]?: T[K2];
};

type BaseImpersonated<Base, As = ImpersonatedName> = Base & {
  className?: string;
  children?: ReactNode;
  as: As;
};

export type ImpersonatedProps<
  Base,
  As extends ImpersonatedName,
> = ComponentProps<As> & BaseImpersonated<Base, As>;

export type ImpersonatedComponent<Base, Default extends ImpersonatedName> = {
  <As extends ImpersonatedName>(
    props: ImpersonatedProps<Base, As>
  ): ReactElement;
  (props: Base & ComponentProps<Default>): ReactElement;
};

export function impersonatedComponent<Base, Default extends ImpersonatedName>(
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
