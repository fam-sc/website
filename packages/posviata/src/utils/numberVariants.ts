export type NumberVariant = 'one' | 'few' | 'many';

export function getNumberVariant(value: number): NumberVariant {
  if (value === 1) {
    return 'one';
  } else if (value > 1 && value < 5) {
    return 'few';
  } else if (value > 20) {
    const lastDigit = value % 10;

    return getNumberVariant(lastDigit);
  }

  return 'many';
}
