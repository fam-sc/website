import { DAY_MS, HOUR_MS, MINUTE_MS } from '@sc-fam/shared/chrono';
import { useEffect, useState } from 'react';

export type DateInterval = {
  days: number;
  hours: number;
  minutes: number;
};

function getDifference(
  targetDate: Date,
  now: number = Date.now()
): DateInterval {
  let diff = Math.max(0, targetDate.getTime() - now);

  const days = Math.floor(diff / DAY_MS);
  diff -= days * DAY_MS;

  const hours = Math.floor(diff / HOUR_MS);
  diff -= hours * HOUR_MS;

  const minutes = Math.floor(diff / MINUTE_MS);

  return { days, hours, minutes };
}

export function useCountdown(targetDate: Date): DateInterval {
  const [interval, setInterval] = useState(() => getDifference(targetDate));

  useEffect(() => {
    const scheduleTick = (now: number) => {
      const delay = MINUTE_MS - (now % MINUTE_MS);

      setTimeout(tick, delay);
    };

    const tick = () => {
      const now = Date.now();

      setInterval(getDifference(targetDate, now));
      scheduleTick(now);
    };

    scheduleTick(Date.now());
  });

  return interval;
}
