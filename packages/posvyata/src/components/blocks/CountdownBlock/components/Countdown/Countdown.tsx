import { formatTwoDigit } from '@sc-fam/shared/string/formatter.js';

import { Typography } from '@/components/Typography';
import { DateInterval, useCountdown } from '@/hooks/useCountdown';
import { classNames } from '@/utils/classNames';
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

  return (
    <div className={styles.part}>
      <Typography font="press-start" className={styles.main}>
        {formatTwoDigit(countdown[type])}
      </Typography>

      <Typography font="press-start" className={styles.measure}>
        {variants[variant]}
      </Typography>
    </div>
  );
}

export function Countdown({ className }: CountdownProps) {
  const countdown = useCountdown(TARGET_DATE);

  return (
    <div className={classNames(styles.root, className)}>
      <TimePart countdown={countdown} type="days" />
      <span className={styles.main}>:</span>
      <TimePart countdown={countdown} type="hours" />
      <span className={styles.main}>:</span>
      <TimePart countdown={countdown} type="minutes" />
    </div>
  );
}
