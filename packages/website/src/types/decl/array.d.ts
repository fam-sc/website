export declare global {
  export interface ReadonlyArray<T> {
    // Extends standard lib's include. For example, if x is in number[], then x is number.
    includes(value: unknown, fromIndex?: number): value is T;
  }

  export interface Array<T> {
    // Extends standard lib's include. For example, if x is in number[], then x is number.
    includes(value: unknown, fromIndex?: number): value is T;
  }
}
