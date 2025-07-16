function hasId<T>(values: { id: T }[], id: T): boolean {
  for (const value of values) {
    if (value.id === id) {
      return true;
    }
  }

  return false;
}

export function findNextId(values: { id: string }[]): string {
  for (let index = 0; ; index++) {
    const id = index.toString();

    if (!hasId(values, id)) {
      return id;
    }
  }
}
