import { SvgProps } from '../types';

export function PlusIcon(props: SvgProps) {
  return (
    <svg width="24" height="24" viewBox="0 -960 960 960" {...props}>
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  );
}
