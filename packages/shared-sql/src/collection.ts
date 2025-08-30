import { D1Database, D1PreparedStatement } from '@sc-fam/shared/cloudflare';

import { batchWithResultsHelper } from './batch';
import {
  buildCountWhereQuery,
  buildCreateTableQuery,
  buildDeleteWhereQuery,
  buildFindWhereQuery,
  buildGeneralInsertQuery,
  buildGetPageQuery,
  buildUpdateWhereQuery,
  Conditions,
  DataQuery,
  DataQueryContext,
  Fields,
  getConditionsBinding,
  InsertFlavor,
  Ordering,
  query,
  RawConditions,
  TableDescriptor,
} from './builder';

export type EntityCollectionClass<T = unknown> = new (client: D1Database) => T;

export function EntityCollection<Raw extends object>(tableName: string) {
  return class {
    client: D1Database;
    queryContext: DataQueryContext;

    constructor(client: D1Database) {
      this.client = client;
      this.queryContext = {
        batch(queries) {
          return batchWithResultsHelper(client, queries);
        },
      };
    }

    async updateWhere(conditions: Conditions<Raw>, value: Partial<Raw>) {
      const valueItems = Object.values(value).filter(
        (item) => item !== undefined
      );

      const { meta } = await this.client
        .prepare(buildUpdateWhereQuery(tableName, conditions, value))
        .bind(...valueItems, ...getConditionsBinding(conditions))
        .run();

      return { changes: meta.changes };
    }

    updateWhereAction(conditions: Conditions<Raw>, value: Partial<Raw>) {
      return query
        .first(
          this.client
            .prepare(buildUpdateWhereQuery(tableName, conditions, value))
            .bind(...Object.values(value), ...getConditionsBinding(conditions))
        )
        .map((_, [result]) => ({ changes: result.meta.changes }));
    }

    selectAllAction<R = Raw>(
      sql: string,
      bindings?: unknown[]
    ): DataQuery<R[]> {
      return query.all(this.client.prepare(sql).bind(...(bindings ?? [])));
    }

    async selectAll<R = Raw>(sql: string, bindings?: unknown[]): Promise<R[]> {
      const { results } = await this.client
        .prepare(sql)
        .bind(...(bindings ?? []))
        .all<R>();

      return results;
    }

    selectOneAction<R = Raw>(
      sql: string,
      bindings: unknown[] = []
    ): DataQuery<R | null> {
      return query.first(this.client.prepare(sql).bind(...bindings));
    }

    async selectOne<R = Raw>(
      sql: string,
      bindings: unknown[] = []
    ): Promise<R | null> {
      return this.client
        .prepare(sql)
        .bind(...bindings)
        .first<R>();
    }

    insertBaseAction<R extends keyof Raw & string>(
      flavor: InsertFlavor,
      value: Partial<Raw>,
      returning?: R
    ): DataQuery<Raw[R] | undefined> {
      const statement = this.client
        .prepare(buildGeneralInsertQuery(flavor, tableName, value, returning))
        .bind(...Object.values(value));

      return query.first<Record<R, Raw[R]>>(statement).map((result) => {
        if (result === null || returning === undefined) {
          return undefined;
        }

        return result[returning];
      });
    }

    async insertBase<R extends keyof Raw & string>(
      flavor: InsertFlavor,
      value: Partial<Raw>,
      returning?: R
    ): Promise<Raw[R] | undefined> {
      const result = await this.client
        .prepare(buildGeneralInsertQuery(flavor, tableName, value, returning))
        .bind(...Object.values(value))
        .first<Record<R, Raw[R]>>();

      if (result === null || returning === undefined) {
        return undefined;
      }

      return result[returning];
    }

    insert<R extends keyof Raw & string>(
      value: Partial<Raw>
    ): Promise<Raw[R] | undefined>;

    insert<R extends keyof Raw & string>(
      value: Partial<Raw>,
      returning: R
    ): Promise<Raw[R]>;

    insert<R extends keyof Raw & string>(
      value: Partial<Raw>,
      returning?: R
    ): Promise<Raw[R] | undefined> {
      return this.insertBase('INSERT', value, returning);
    }

    insertOrReplace<R extends keyof Raw & string>(
      value: Partial<Raw>,
      returning?: R
    ): Promise<Raw[R] | undefined> {
      return this.insertBase('INSERT OR REPLACE', value, returning);
    }

    insertOrReplaceAction<R extends keyof Raw & string>(
      value: Partial<Raw>,
      returning?: R
    ): DataQuery<Raw[R] | undefined> {
      return this.insertBaseAction('INSERT OR REPLACE', value, returning);
    }

    insertOrIgnoreAction<R extends keyof Raw & string>(
      value: Partial<Raw>,
      returning?: R
    ): DataQuery<Raw[R] | undefined> {
      return this.insertBaseAction('INSERT OR IGNORE', value, returning);
    }

    insertManyBaseAction<R extends keyof Raw & string>(
      flavor: InsertFlavor,
      values: Partial<Raw>[],
      returning?: R
    ): DataQuery<Raw[R] | undefined>[] {
      return values.map((value) =>
        this.insertBaseAction(flavor, value, returning)
      );
    }

    async insertManyBase<R extends keyof Raw & string>(
      flavor: InsertFlavor,
      values: Partial<Raw>[],
      returning?: R
    ): Promise<Raw[R][] | undefined> {
      const result = await Promise.all(
        values.map((value) => this.insertBase(flavor, value, returning))
      );

      return returning !== undefined ? (result as Raw[R][]) : undefined;
    }

    insertMany(values: Partial<Raw>[]): Promise<void>;

    insertMany<R extends keyof Raw & string>(
      values: Partial<Raw>[],
      returning: R
    ): Promise<Raw[R][]>;

    async insertMany<Value extends Partial<Raw>, R extends keyof Raw & string>(
      values: Value[],
      returning?: R
    ): Promise<Raw[R][] | void> {
      return this.insertManyBase('INSERT', values, returning);
    }

    insertOrReplaceMany(values: Partial<Raw>[]): Promise<void>;

    insertOrReplaceMany<R extends keyof Raw & string>(
      values: Partial<Raw>[],
      returning: R
    ): Promise<Raw[R][]>;

    async insertOrReplaceMany<
      Value extends Partial<Raw>,
      R extends keyof Raw & string,
    >(values: Value[], returning?: R): Promise<Raw[R][] | void> {
      return this.insertManyBase('INSERT OR REPLACE', values, returning);
    }

    insertOrReplaceManyAction<R extends keyof Raw & string>(
      values: Partial<Raw>[],
      returning?: R
    ) {
      return this.insertManyBaseAction('INSERT OR REPLACE', values, returning);
    }

    prepareFindWhereStatement(
      conditions: RawConditions,
      fields?: Fields
    ): D1PreparedStatement {
      const bindings = getConditionsBinding(conditions);

      return this.client
        .prepare(buildFindWhereQuery(tableName, conditions, fields))
        .bind(...bindings);
    }

    findOneWhereAction<K extends keyof Raw & string = keyof Raw & string>(
      conditions: Conditions<Raw>,
      fields?: (K & string)[] | '*'
    ): DataQuery<Pick<Raw, K> | null> {
      return query.first(this.prepareFindWhereStatement(conditions, fields));
    }

    findOneWhere<K extends keyof Raw & string = keyof Raw & string>(
      conditions: Conditions<Raw>,
      fields?: K[] | '*'
    ): Promise<Pick<Raw, K> | null> {
      return this.prepareFindWhereStatement(conditions, fields).first();
    }

    async findManyWhere<K extends keyof Raw & string = keyof Raw & string>(
      conditions: Conditions<Raw>,
      fields?: K[] | '*'
    ): Promise<Pick<Raw, K>[]> {
      const { results } = await this.prepareFindWhereStatement(
        conditions,
        fields
      ).all<Pick<Raw, K>>();

      return results;
    }

    findManyWhereAction<K extends keyof Raw & string = keyof Raw & string>(
      conditions: Conditions<Raw>,
      fields?: K[] | '*'
    ): DataQuery<Pick<Raw, K>[]> {
      return query.all(this.prepareFindWhereStatement(conditions, fields));
    }

    getPageBase<K extends keyof Raw & string = keyof Raw & string>(
      offset: number,
      size: number,
      conditions: Conditions<Raw> = {},
      fields?: K[] | '*'
    ): DataQuery<Pick<Raw, K>[]> {
      return this.selectAllAction(
        buildGetPageQuery({
          tableName,
          offset,
          size,
          conditions,
          fields,
        }),
        getConditionsBinding(conditions)
      );
    }

    async getPageWithTotalSize(
      index: number,
      size: number,
      ordering?: Ordering<Raw>
    ) {
      const [count, guides] = await this.client.batch([
        this.client.prepare(buildCountWhereQuery(tableName)),
        this.client.prepare(
          buildGetPageQuery({ tableName, offset: index * size, size, ordering })
        ),
      ]);

      return {
        total: (count.results[0] as { count: number }).count,
        items: guides.results as Raw[],
      };
    }

    deleteWhere(conditions: Conditions<Raw>) {
      return query
        .first(
          this.client
            .prepare(buildDeleteWhereQuery(tableName, conditions))
            .bind(...getConditionsBinding(conditions))
        )
        .map((_, [result]) => {
          return { changes: result.meta.changes };
        });
    }

    async deleteAll() {
      await this.client.prepare(`DELETE FROM ${tableName}`).run();
    }

    count(conditions?: Conditions<Raw>): DataQuery<number> {
      const statement = this.client
        .prepare(buildCountWhereQuery(tableName, conditions))
        .bind(...(conditions ? getConditionsBinding(conditions) : []));

      return query
        .first<{ count: number }>(statement)
        .map((result) => result?.count ?? 0);
    }

    all<K extends keyof Raw & string>(
      fields: K[] | '*' = '*'
    ): DataQuery<Pick<Raw, K>[]> {
      return this.findManyWhereAction({}, fields);
    }

    createTable(schema: TableDescriptor<Raw>) {
      return this.client.exec(buildCreateTableQuery(tableName, schema));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getCollection<T>(_type: EntityCollectionClass<T>): T {
      throw new Error('Not implemented');
    }

    static descriptor(): TableDescriptor<Raw> {
      throw new Error('Not implemented');
    }

    static toString(): string {
      return tableName;
    }
  };
}
