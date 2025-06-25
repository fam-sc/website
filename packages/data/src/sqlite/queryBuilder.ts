import { repeatJoin } from '../../../shared/src/string/repeatJoin';
import { qMarks } from './expression';
import {
  getMaybeModifierValue,
  isModifier,
  isNoBinding,
  Modifier,
} from './modifier';
import { TableDescriptor } from './types';

export type InsertFlavor = 'INSERT' | 'INSERT OR REPLACE';

export type Conditions<T> = {
  [K in keyof T]?: T[K] | Modifier;
};

type Fields<T> = (T & string)[] | '*';
type Keyword = 'WHERE' | 'RETURNING' | 'LIMIT' | 'OFFSET';

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

function resolveFields(fields: Fields<string> | undefined): string {
  return Array.isArray(fields) ? joinColumns(fields) : '*';
}

function maybeModifierToKeyValue(key: string, value: unknown): string {
  return isModifier(value) ? `"${key}"${value.expression}` : `"${key}"=?`;
}

function conditionsToWhereClause(
  conditions: Conditions<unknown> | undefined
): string {
  return conditions
    ? Object.entries(conditions)
        .map(([key, value]) => maybeModifierToKeyValue(key, value))
        .join(' AND ')
    : '';
}

function selectFromTable(columns: string, tableName: string): string {
  return `SELECT ${columns} FROM ${tableName}`;
}

export function getConditionsBinding(conditions: Conditions<unknown>) {
  return Object.values(conditions)
    .flatMap((value) => getMaybeModifierValue(value))
    .filter((value) => !isNoBinding(value));
}

export function buildGeneralInsertQuery<T extends object>(
  flavor: InsertFlavor,
  tableName: string,
  value: T,
  returning?: keyof T & string
): string {
  const keys = Object.keys(value);
  const columns = joinColumns(keys);

  return withKeyword(
    `${flavor} INTO "${tableName}" (${columns}) VALUES (${qMarks(keys.length)})`,
    'RETURNING',
    returning && `"${returning}"`
  );
}

export function buildGeneralInsertManyQuery<T extends object>(
  flavor: InsertFlavor,
  tableName: string,
  values: T[],
  returning?: keyof T & string
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

export function buildFindWhereQuery<T>(
  tableName: string,
  conditions: Conditions<T>,
  fields?: Fields<keyof T>
): string {
  return withKeyword(
    selectFromTable(resolveFields(fields), tableName),
    'WHERE',
    conditionsToWhereClause(conditions)
  );
}

export function buildCountWhereQuery<T>(
  tableName: string,
  conditions?: Conditions<T>
): string {
  return withKeyword(
    selectFromTable(`COUNT(*) as count`, tableName),
    'WHERE',
    conditionsToWhereClause(conditions)
  );
}

export function buildGetPageQuery(
  tableName: string,
  offset: number,
  size: number,
  conditions?: Conditions<unknown>,
  fields?: Fields<unknown>
): string {
  return withKeyword(
    withKeyword(
      withKeyword(
        selectFromTable(resolveFields(fields), tableName),
        'WHERE',
        conditionsToWhereClause(conditions)
      ),
      'LIMIT',
      size
    ),
    'OFFSET',
    offset > 0 ? offset : undefined
  );
}

export function buildUpdateWhereQuery<T extends object>(
  tableName: string,
  conditions: Conditions<T>,
  updated: Partial<T>
): string {
  const set = Object.entries(updated)
    .map(([key, value]) => (value !== undefined ? `"${key}"=?` : undefined))
    .filter((value) => value !== undefined)
    .join(',');

  return withKeyword(
    `UPDATE "${tableName}" SET ${set}`,
    'WHERE',
    conditionsToWhereClause(conditions)
  );
}

export function buildDeleteWhereQuery(
  tableName: string,
  conditions: Conditions<unknown>
) {
  return withKeyword(
    `DELETE FROM "${tableName}"`,
    'WHERE',
    conditionsToWhereClause(conditions)
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
