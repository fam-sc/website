export class LocalStorageAccessor {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  set(key: string, value: string) {
    try {
      localStorage.setItem(`${this.prefix}-${key}`, value);
    } catch (error: unknown) {
      // Do not rethrow error to the client if it's QuotaExceededError.
      // The client must be aware that the item is not always set and act accordingly
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error(error);
      } else {
        throw error;
      }
    }
  }

  get(key: string): string | null {
    return localStorage.getItem(`${this.prefix}-${key}`);
  }
}
