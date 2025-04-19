function hasId(values: { id: string }[], id: string): boolean {
  for (const value of values) {
    if (value.id === id) {
      return true;
    }
  }

  return false;
}

export function findNextId(prefix: string, values: { id: string }[]): string {
  for (let index = 0; ; index++) {
    const id = `${prefix}-${index}`;

    if (!hasId(values, id)) {
      return id;
    }
  }
}
