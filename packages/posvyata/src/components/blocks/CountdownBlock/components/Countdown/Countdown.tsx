import { AnimatedText } from '@/components/AnimatedText';
import { Typography } from '@/components/Typography';
import { DateInterval, useCountdown } from '@/hooks/useCountdown';
import { classNames } from '@/utils/classNames';
import { formatCountdown } from '@/utils/formatter';
import { getNumberVariant, NumberVariant } from '@/utils/numberVariants';

import styles from './Countdown.module.scss';

export interface CountdownProps {
  className?: string;
}

const TARGET_DATE = new Date('2025-09-20T00:00:00Z');

type Variants = Record<NumberVariant, string>;

const variantMap: Record<keyof DateInterval, Variants> = {
  days: {
    one: 'День',
    few: 'Дні',
    many: 'Днів',
  },
  hours: {
    one: 'Година',
    few: 'Години',
    many: 'Годин',
  },
  minutes: {
    one: 'Хвилина',
    few: 'Хвилини',
    many: 'Хвилин',
  },
};

interface TimePartProps {
  countdown: DateInterval;
  type: keyof DateInterval;
}

function TimePart({ countdown, type }: TimePartProps) {
  const variants = variantMap[type];
  const variant = getNumberVariant(countdown[type]);

  return <Typography font="press-start">{variants[variant]}</Typography>;
}

export function Countdown({ className }: CountdownProps) {
  const countdown = useCountdown(TARGET_DATE);

  return (
    <div className={classNames(styles.root, className)}>
      <AnimatedText className={styles.text} text={formatCountdown(countdown)} />

      <div className={styles.timing}>
        <TimePart countdown={countdown} type="days" />
        <TimePart countdown={countdown} type="hours" />
        <TimePart countdown={countdown} type="minutes" />
      </div>
    </div>
  );
}
