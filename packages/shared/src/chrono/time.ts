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
