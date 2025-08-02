export type Time = `${number}:${number}`;

// Returns distance (total minutes) between two time points.
function distanceBetween(a: Time, b: Time): number {
  const aColonIndex = a.indexOf(':');
  const bColonIndex = b.indexOf(':');

  const aHour = Number.parseInt(a.slice(0, aColonIndex));
  const aMinute = Number.parseInt(a.slice(aColonIndex + 1));

  const bHour = Number.parseInt(b.slice(0, bColonIndex));
  const bMinute = Number.parseInt(b.slice(bColonIndex + 1));

  return Math.abs((aHour - bHour) * 60 + (aMinute - bMinute));
}

export function findNearestTimePoint<T extends Time>(
  times: readonly T[],
  target: Time
): T | undefined {
  let minTime: T | undefined;
  let minDistance: number = Number.POSITIVE_INFINITY;

  for (const time of times) {
    const distance = distanceBetween(time, target);
    if (Number.isNaN(distance)) {
      throw new TypeError('Invalid time points');
    }

    if (distance < minDistance) {
      minDistance = distance;
      minTime = time;
    }
  }

  return minTime;
}

export function getLocalDate(date: Date, timeZone: string): Date {
  const longOffsetFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  });

  const longOffsetString = longOffsetFormatter.format(date);

  const gmtIndex = longOffsetString.indexOf('GMT');

  const colonIndex = longOffsetString.indexOf(':', gmtIndex);
  const gmtOffset =
    Number.parseInt(longOffsetString.slice(gmtIndex + 3, colonIndex)) * 3600 +
    Number.parseInt(longOffsetString.slice(colonIndex + 1)) * 60;

  return new Date(date.getTime() + gmtOffset * 1000);
}

export function getLocalNow(timeZone: string): Date {
  return getLocalDate(new Date(), timeZone);
}
