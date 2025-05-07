// Kyiv is UTC+3
const HOUR_OFFSET = 3;

type Time = {
  hour: number;
  minute: number;
};

export function parseCronTimeToLocal(input: string): Time {
  const [minuteString, hourString] = input.split(' ');

  const hour = Number.parseInt(hourString);
  const minute = Number.parseInt(minuteString);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new TypeError('Invalid cron time');
  }

  return { hour: hour + HOUR_OFFSET, minute };
}
