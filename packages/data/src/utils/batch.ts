import { D1Database, D1Result } from '@shared/cloudflare/d1/types';
import { DataQueryArray } from '../sqlite/query';

export async function batchHelper<T extends unknown[]>(
  client: D1Database,
  queries: DataQueryArray<T>
): Promise<T> {
  const [value] = await batchWithResultsHelper(client, queries);

  return value;
}

export async function batchWithResultsHelper<T extends unknown[]>(
  client: D1Database,
  queries: DataQueryArray<T>
): Promise<[T, D1Result[]]> {
  const results = await client.batch(
    queries.flatMap(({ statements }) => statements)
  );

  let resultOffset = 0;
  const values = queries.map((query) => {
    const part = results.slice(
      resultOffset,
      resultOffset + query.statements.length
    );
    resultOffset += query.statements.length;

    return query.mapResult(part);
  }) as T;

  return [values, results];
}
