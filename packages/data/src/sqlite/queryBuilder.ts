import { repeatJoin } from '@shared/string/repeatJoin';
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

function withFactory(
  infix: string
): (value: string, suffix?: string) => string {
  return (value, suffix) =>
    suffix !== undefined ? `${value} ${infix} ${suffix}` : value;
}

const withReturning = withFactory('RETURNING');
const withWhere = withFactory('WHERE');

function joinColumns(array: string[]): string {
  return array.map((item) => `"${item}"`).join(',');
}

function resolveFields(fields: Fields<string> | undefined): string {
  return Array.isArray(fields) ? joinColumns(fields) : '*';
}

function maybeModifierToKeyValue(key: string, value: unknown): string {
  return isModifier(value) ? `"${key}"${value.expression}` : `"${key}"=?`;
}

function conditionsToWhereClause(conditions: Conditions<unknown>): string {
  return Object.entries(conditions)
    .map(([key, value]) => maybeModifierToKeyValue(key, value))
    .join(' AND ');
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

  return withReturning(
    `${flavor} INTO "${tableName}" (${columns}) VALUES (${qMarks(keys.length)})`,
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

  return withReturning(
    `${flavor} INTO "${tableName}" (${columns}) VALUES ${qMarkTemplate}`,
    returning && `"${returning}"`
  );
}

export function buildFindWhereQuery<T>(
  tableName: string,
  conditions: Conditions<T>,
  fields?: Fields<keyof T>
): string {
  return withWhere(
    `SELECT ${resolveFields(fields)} FROM "${tableName}"`,
    conditionsToWhereClause(conditions)
  );
}

export function buildCountWhereQuery<T>(
  tableName: string,
  conditions?: Conditions<T>
): string {
  const whereClause = conditions ? conditionsToWhereClause(conditions) : '';

  return withWhere(`SELECT COUNT(*) as count FROM "${tableName}"`, whereClause);
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

  return `UPDATE "${tableName}" SET ${set} WHERE ${conditionsToWhereClause(conditions)}`;
}

export function buildDeleteWhereQuery(
  tableName: string,
  conditions: Conditions<unknown>
) {
  return `DELETE FROM "${tableName}" WHERE ${conditionsToWhereClause(conditions)}`;
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
