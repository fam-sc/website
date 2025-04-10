type ClassName = string | null | undefined | false;

export function classNames(...args: ClassName[]): string {
  return args.filter((value) => !!value).join(' ');
}
