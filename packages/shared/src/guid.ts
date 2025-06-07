function trimZeros(value: string): string {
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== '0') {
      return value.slice(i);
    }
  }

  return '';
}

function appendZeros(value: string, totalLength: number): string {
  const prefix = '0'.repeat(Math.max(0, totalLength - value.length));

  return prefix + value;
}

const DROP_PART = '0000-0000-0000-000000000000';

export function shortenGuid(value: string): string {
  const dashIndex = value.indexOf('-');

  if (dashIndex === -1) {
    return value;
  }

  const rest = value.slice(dashIndex + 1);

  if (rest === DROP_PART) {
    return trimZeros(value.slice(0, dashIndex));
  }

  return value;
}

export function normalizeGuid(value: string): string {
  if (value.includes('-')) {
    return value;
  }

  return `${appendZeros(value, 8)}-${DROP_PART}`;
}
