export function differentIndices(oldText: string, newText: string): number[] {
  const result: number[] = [];

  for (let i = 0; i < Math.min(oldText.length, newText.length); i += 1) {
    if (oldText[i] !== newText[i]) {
      result.push(i);
    }
  }

  return result;
}
