type FC = import('react').FC;
type ReactNode = import('react').ReactNode;

declare module '*.md?react' {
  const _default: FC;

  export default _default;
}
