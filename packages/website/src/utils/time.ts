import { parseTime } from '@sc-fam/shared/chrono';

type Component = `${number}`;

export type Time = `${Component}:${Component}`;

function padZero(value: number): Component {
  return value.toString().padStart(2, '0') as Component;
}

export function secondsToTime(value: number): Time {
  const hour = Math.floor(value / 3600);
  value -= hour * 3600;

  const minute = Math.floor(value / 60);

  return `${padZero(hour)}:${padZero(minute)}`;
}

export function parseTimeString(time: Time): number {
  const { hour, minute } = parseTime(time);

  return hour * 3600 + minute * 60;
}
