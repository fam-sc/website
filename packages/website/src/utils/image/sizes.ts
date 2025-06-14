import { ImageSizes } from './types';

export function resolveSizes(
  value: string | ImageSizes | undefined
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  const parts = Object.entries(value).map(([key, value]) =>
    key === 'default' ? value : `(min-width: ${key}px) ${value}`
  );

  return parts.join(', ');
}
