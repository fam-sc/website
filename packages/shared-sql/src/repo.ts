import { D1Database } from '@sc-fam/shared/cloudflare';

import { buildCreateTableQuery, TableDescriptor } from './builder';
import { EntityCollectionClass } from './collection';

export type RepositoryInput = Record<string, EntityCollectionClass>;

type ResolveEntityCollection<T> =
  T extends EntityCollectionClass<infer R> ? () => R : never;

export type Repository<Input extends RepositoryInput> = {
  [K in keyof Input]: ResolveEntityCollection<Input[K]>;
} & {
  init(): Promise<void>;
};

let defaultDatabase: D1Database | undefined;

export function setDefaultDatabase(db: D1Database) {
  defaultDatabase = db;
}

export function getDefaultDatabase(): D1Database {
  const result = defaultDatabase;
  if (result === undefined) {
    throw new Error('No default database');
  }

  return result;
}

export function createRepository<Input extends RepositoryInput>(
  input: Input
): Repository<Input> {
  return {
    ...Object.fromEntries(
      Object.entries(input).map(([name, repoClass]) => [
        name,
        () => new repoClass(getDefaultDatabase()),
      ])
    ),
    async init() {
      type DescriptorClass = {
        descriptor: () => TableDescriptor<unknown>;
        toString: () => string;
      };

      const db = getDefaultDatabase();

      await Promise.all(
        Object.values(input).map(async (tempClass) => {
          const repoClass = tempClass as unknown as DescriptorClass;

          const descriptor = repoClass.descriptor();

          await db.exec(
            buildCreateTableQuery(repoClass.toString(), descriptor)
          );
        })
      );
    },
  } as Repository<Input>;
}
