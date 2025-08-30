import { repeatJoin } from '@sc-fam/shared/string';

import {
  Conditions,
  conditionsToExpression,
  RawConditions,
} from './conditions';
import { qMarks } from './expression';
import { TableDescriptor } from './types';

export type InsertFlavor = 'INSERT' | 'INSERT OR REPLACE' | 'INSERT OR IGNORE';
export type OrderingType = 'ASC' | 'DESC';

export type RawOrdering<K extends string = string> = {
  key: K;
  type: OrderingType;
};

export type Ordering<T> = RawOrdering<keyof T & string>;
export type Fields<T = string> = (T & string)[] | '*';

type Keyword = 'WHERE' | 'RETURNING' | 'LIMIT' | 'OFFSET' | 'ORDER BY';

function withKeyword(
  prefix: string,
  infix: Keyword,
  suffix: string | number | undefined
) {
  return suffix ? `${prefix} ${infix} ${suffix}` : prefix;
}

function joinColumns(array: string[]): string {
  return array.map((item) => `"${item}"`).join(',');
}

function resolveFields(fields: Fields | undefined): string {
  return Array.isArray(fields) ? joinColumns(fields) : '*';
}

function selectFromTable(columns: string, tableName: string): string {
  return `SELECT ${columns} FROM "${tableName}"`;
}

export function buildGeneralInsertQuery(
  flavor: InsertFlavor,
  tableName: string,
  value: object,
  returning?: string
): string {
  const keys = Object.keys(value);
  const columns = joinColumns(keys);

  return withKeyword(
    `${flavor} INTO "${tableName}" (${columns}) VALUES (${qMarks(keys.length)})`,
    'RETURNING',
    returning && `"${returning}"`
  );
}

export function buildGeneralInsertManyQuery(
  flavor: InsertFlavor,
  tableName: string,
  values: object[],
  returning?: string
) {
  const [template] = values;
  const keys = Object.keys(template);
  const columns = joinColumns(keys);
  const qMarkTemplate = repeatJoin(
    `(${qMarks(keys.length)})`,
    ',',
    values.length
  );

  return withKeyword(
    `${flavor} INTO "${tableName}" (${columns}) VALUES ${qMarkTemplate}`,
    'RETURNING',
    returning && `"${returning}"`
  );
}

export function buildFindWhereQuery(
  tableName: string,
  conditions: RawConditions,
  fields?: Fields
): string {
  return withKeyword(
    selectFromTable(resolveFields(fields), tableName),
    'WHERE',
    conditionsToExpression(conditions)
  );
}

export function buildCountWhereQuery(
  tableName: string,
  conditions?: RawConditions
): string {
  return withKeyword(
    selectFromTable(`COUNT(*) as count`, tableName),
    'WHERE',
    conditionsToExpression(conditions)
  );
}

type GetPageOptions = {
  tableName: string;
  offset: number;
  size: number;
  conditions?: RawConditions;
  fields?: Fields;
  ordering?: RawOrdering;
};

export function buildGetPageQuery(options: GetPageOptions): string {
  const { offset, ordering } = options;

  return withKeyword(
    withKeyword(
      withKeyword(
        withKeyword(
          selectFromTable(resolveFields(options.fields), options.tableName),
          'WHERE',
          conditionsToExpression(options.conditions)
        ),
        'ORDER BY',
        ordering !== undefined
          ? `"${ordering.key}" ${ordering.type}`
          : undefined
      ),
      'LIMIT',
      options.size
    ),
    'OFFSET',
    offset > 0 ? offset : undefined
  );
}

export function buildUpdateWhereQuery(
  tableName: string,
  conditions: Conditions<object>,
  updated: Partial<object>
): string {
  const set = Object.entries(updated)
    .map(([key, value]) => (value !== undefined ? `"${key}"=?` : undefined))
    .filter((value) => value !== undefined)
    .join(',');

  return withKeyword(
    `UPDATE "${tableName}" SET ${set}`,
    'WHERE',
    conditionsToExpression(conditions)
  );
}

export function buildDeleteWhereQuery(
  tableName: string,
  conditions: Conditions<unknown>
) {
  return withKeyword(
    `DELETE FROM "${tableName}"`,
    'WHERE',
    conditionsToExpression(conditions)
  );
}

export function buildCreateTableQuery<T>(
  tableName: string,
  schema: TableDescriptor<T>
) {
  const schemaString = Object.entries(schema)
    .map(([key, value]) => `"${key}" ${value}`)
    .join(',');

  return `CREATE TABLE IF NOT EXISTS "${tableName}" (${schemaString})`;
}
