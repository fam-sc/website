export type WithDataSpace<T extends string> = {
  [K in `data-${T}`]?: never;
};

export type TitleRequiredProps =
  | {
      'aria-hidden': true;
      title?: string;
    }
  | {
      'aria-hidden'?: false;
      title: string;
    };
