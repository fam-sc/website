import { classNames } from '@/utils/classNames';

export interface AnimatedLinePlotProps {
  className?: string;
  data: string;
}

export function AnimatedLinePlot({ className, data }: AnimatedLinePlotProps) {
  return (
    <svg className={classNames(className)} viewBox="0 0 500 150">
      <path d={data} />
    </svg>
  );
}
