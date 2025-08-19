export function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = items.length - 1; i >= 0; i -= 1) {
    const j = Math.floor(Math.random() * items.length);

    const t = items[i];
    items[i] = items[j];
    items[j] = t;
  }

  return result;
}
