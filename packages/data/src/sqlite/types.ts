export type ColumnSimpleType<T> = T extends string
  ? 'TEXT'
  : T extends number
    ? 'INTEGER' | 'REAL'
    : never;

type ColumnTypeNullability<T> =
  | ColumnSimpleType<T>
  | (null extends T ? never : `${ColumnSimpleType<T>} NOT NULL`);

type Concat<T extends string, U extends string> = T | `${T} ${U}`;

type PrimaryKeyModifier = Concat<'PRIMARY KEY', 'AUTOINCREMENT'>;

export type ColumnDescriptor<T> = Concat<
  ColumnTypeNullability<T>,
  PrimaryKeyModifier
>;

export type TableDescriptor<T> = { [K in keyof T]: ColumnDescriptor<T[K]> };
