export function getDataUrlContent(input: string): Buffer {
  const commaIndex = input.indexOf(',');
  if (commaIndex === -1) {
    throw new Error('Invalid data url');
  }

  const base64 = input.slice(commaIndex + 1);

  return Buffer.from(base64, 'base64');
}
