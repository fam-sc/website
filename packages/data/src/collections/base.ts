import { D1Database, D1PreparedStatement } from '@shared/cloudflare/d1/types';

import {
  InsertFlavor,
  buildGeneralInsertQuery,
  Conditions,
  buildFindWhereQuery,
  buildUpdateWhereQuery,
  buildDeleteWhereQuery,
  buildCreateTableQuery,
  buildCountWhereQuery,
  getConditionsBinding,
} from '../sqlite/queryBuilder';
import { TableDescriptor, TableDescriptors } from '../sqlite/types';
import { DataQuery, query } from '../sqlite/query';

export function EntityCollection<Raw extends object>(tableName: string) {
  type Fields<S = Raw> = (keyof S & string)[] | '*';

  return class {
    protected client: D1Database;

    constructor(client: D1Database) {
      this.client = client;
    }

    protected async updateWhere(
      conditions: Conditions<Raw>,
      value: Partial<Raw>
    ) {
      const { meta } = await this.client
        .prepare(buildUpdateWhereQuery(tableName, conditions, value))
        .bind(...Object.values(value), ...getConditionsBinding(conditions))
        .run();

      return { changes: meta.changes };
    }

    protected selectAllAction<R = Raw>(
      sql: string,
      bindings?: unknown[]
    ): DataQuery<R[]> {
      return query.all(this.client.prepare(sql).bind(...(bindings ?? [])));
    }

    protected async selectAll<R = Raw>(
      sql: string,
      bindings?: unknown[]
    ): Promise<R[]> {
      const { results } = await this.client
        .prepare(sql)
        .bind(...(bindings ?? []))
        .all<R>();

      return results;
    }

    protected selectOneAction<R = Raw>(
      sql: string,
      bindings: unknown[] = []
    ): DataQuery<R | null> {
      console.log(bindings);
      return query.first(this.client.prepare(sql).bind(...bindings));
    }

    protected async selectOne<R = Raw>(
      sql: string,
      bindings: unknown[] = []
    ): Promise<R | null> {
      console.log(bindings);
      return this.client
        .prepare(sql)
        .bind(...bindings)
        .first<R>();
    }

    private insertBaseAction<R extends keyof Raw & string>(
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

    private async insertBase<R extends keyof Raw & string>(
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

    private insertManyBaseAction<R extends keyof Raw & string>(
      flavor: InsertFlavor,
      values: Partial<Raw>[],
      returning?: R
    ): DataQuery<Raw[R] | undefined>[] {
      return values.map((value) =>
        this.insertBaseAction(flavor, value, returning)
      );
    }

    private async insertManyBase<R extends keyof Raw & string>(
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

    private prepareFindWhereStatement<R extends Raw>(
      conditions: Conditions<R>,
      fields?: Fields<Partial<Raw>>,
      otherTableName?: string
    ): D1PreparedStatement {
      const bindings = getConditionsBinding(conditions);

      return this.client
        .prepare(
          buildFindWhereQuery(otherTableName ?? tableName, conditions, fields)
        )
        .bind(...bindings);
    }

    findOneWhereAction<K extends keyof Raw & string = keyof Raw & string>(
      conditions: Conditions<Raw>,
      fields?: K[] | '*',
      otherTableName?: string
    ): DataQuery<Pick<Raw, K> | null> {
      return query.first(
        this.prepareFindWhereStatement(conditions, fields, otherTableName)
      );
    }

    findOneWhere<K extends keyof Raw & string = keyof Raw & string>(
      conditions: Conditions<Raw>,
      fields?: K[] | '*',
      otherTableName?: string
    ): Promise<Pick<Raw, K> | null> {
      return this.prepareFindWhereStatement(
        conditions,
        fields,
        otherTableName
      ).first();
    }

    async findManyWhere<K extends keyof Raw & string = keyof Raw & string>(
      conditions: Conditions<Raw>,
      fields?: K[] | '*',
      otherTableName?: string
    ): Promise<Pick<Raw, K>[]> {
      const { results } = await this.prepareFindWhereStatement(
        conditions,
        fields,
        otherTableName
      ).all<Pick<Raw, K>>();

      return results;
    }

    findManyWhereAction<K extends keyof Raw & string = keyof Raw & string>(
      conditions: Conditions<Raw>,
      fields?: K[] | '*',
      otherTableName?: string
    ): DataQuery<Pick<Raw, K>[]> {
      return query.all(
        this.prepareFindWhereStatement(conditions, fields, otherTableName)
      );
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

    protected createTable(schema: TableDescriptor<Raw>) {
      return this.client.exec(buildCreateTableQuery(tableName, schema));
    }

    static descriptor(): TableDescriptor<Raw> | TableDescriptors<unknown[]> {
      throw new Error('Not implemented');
    }

    static toString(): string {
      return tableName;
    }
  };
}
