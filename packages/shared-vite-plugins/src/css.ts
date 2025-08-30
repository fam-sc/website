const ALPHABET =
  'abcefghijklmnopqrstuvwxyzABCEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

export function encodeNumber(value: number): string {
  let result = '';

  while (value !== 0) {
    const index = value % ALPHABET.length;
    result += ALPHABET.charAt(index);

    value = Math.floor(value / ALPHABET.length);
  }

  return result;
}

export function cssNameGenerator() {
  const PREFIX = `sc`;

  const indices: Record<string, string | undefined> = {};
  let lastIndex = 1;

  return (name: string, filename: string) => {
    const id = `${name}_${filename}`;

    let className = indices[id];
    if (className === undefined) {
      const index = lastIndex++;

      className = encodeNumber(index);
      indices[id] = className;
    }

    return `${PREFIX}${className}`;
  };
}
