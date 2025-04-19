import { Knex } from 'knex';

import { splitBy } from '@/utils/collections';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export abstract class EntityRepository<T extends {}> {
  protected knex: Knex;
  private tableName: string;

  constructor(knex: Knex, tableName: string) {
    this.knex = knex;
    this.tableName = tableName;
  }

  table(): Knex.QueryBuilder<T> {
    return this.knex(this.tableName);
  }

  raw(sql: string, bindigs: Knex.RawBinding) {
    return this.knex.raw(sql, bindigs);
  }
}

export async function upsertBase<T extends { id: string }>(
  values: T[],
  getIds: () => Promise<{ id: string }[]>,
  insert: (values: T[]) => Promise<string[]>,
  update: (value: T) => Promise<number>,
): Promise<Record<string, string>> {
  const ids = await getIds();
  const current = new Set(ids.map(({ id }) => id));

  const [existValues, nonExistValues] = splitBy(values, (value) =>
    current.has(value.id),
  );

  const tasks: Promise<[string, string][]>[] = existValues.map(
    async (value) => {
      await update(value);

      const result: [string, string] = [value.id, value.id];
      return [result];
    },
  );

  if (nonExistValues.length > 0) {
    tasks.push(
      (async () => {
        const ids = await insert(nonExistValues);

        return ids.map((value, index) => [value, ids[index]]);
      })(),
    );
  }

  const entries = await Promise.all(tasks);
  const result: Record<string, string> = {};

  for (const entry of entries) {
    for (const [key, value] of entry) {
      result[key] = value;
    }
  }

  return result;
}
