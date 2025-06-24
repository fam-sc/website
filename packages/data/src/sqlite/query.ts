import { D1PreparedStatement, D1Result } from '@shared/cloudflare/d1/types';

type Mapping<T, R> = (value: T, result: D1Result[]) => R;

export type DataQuery<T> = {
  readonly statements: D1PreparedStatement[];

  mapResult(result: D1Result[]): T;
  map<R>(mapping: Mapping<T, R>): DataQuery<R>;

  getWithResult(): Promise<[T, D1Result[]]>;
  get(): Promise<T>;
};

function mapQuery<T, R>(
  query: DataQuery<T>,
  mapping: Mapping<T, R>
): DataQuery<R> {
  return {
    statements: query.statements,
    mapResult(result) {
      return mapping(query.mapResult(result), result);
    },
    map(mapping2) {
      return mapQuery(this, mapping2);
    },
    async getWithResult() {
      const [value, result] = await query.getWithResult();

      return [mapping(value, result), result];
    },
    async get() {
      const [value, result] = await query.getWithResult();

      return mapping(value, result);
    },
  };
}

function createQuery<T>(
  statements: D1PreparedStatement[],
  rest: Omit<DataQuery<T>, 'statements' | 'map'>
): DataQuery<T> {
  return {
    statements,
    map(mapping) {
      return mapQuery(this, mapping);
    },
    ...rest,
  };
}

function all<T>(statement: D1PreparedStatement): DataQuery<T[]> {
  return createQuery([statement], {
    mapResult([result]) {
      return result.results as T[];
    },
    async getWithResult() {
      const result = await statement.all<T>();

      return [result.results, [result]];
    },
    async get() {
      const { results } = await statement.all<T>();

      return results;
    },
  });
}

function first<T>(statement: D1PreparedStatement): DataQuery<T | null> {
  return createQuery([statement], {
    mapResult([result]) {
      return result.results[0] as T;
    },
    async getWithResult() {
      const result = await statement.all<T>();

      return [result.results[0], [result]];
    },
    async get() {
      return statement.first<T>();
    },
  });
}

function merge<T extends unknown[], R>(
  queries: { [K in keyof T]: DataQuery<T[K]> },
  mapping: (values: T) => R
): DataQuery<R> {
  return createQuery(
    queries.flatMap(({ statements }) => statements),
    {
      async get() {
        const parts = await Promise.all(queries.map((query) => query.get()));

        return mapping(parts as T);
      },
      async getWithResult() {
        const parts = await Promise.all(
          queries.map((query) => query.getWithResult())
        );

        return [
          mapping(parts.map(([value]) => value) as T),
          parts.flatMap(([, result]) => result),
        ];
      },
      mapResult(results) {
        let resultOffset = 0;
        const parts = queries.map((query) => {
          const part = results.slice(
            resultOffset,
            resultOffset + query.statements.length
          );
          resultOffset += query.statements.length;

          return query.mapResult(part);
        });

        return mapping(parts as T);
      },
    }
  );
}

export const query = { all, first, merge };
