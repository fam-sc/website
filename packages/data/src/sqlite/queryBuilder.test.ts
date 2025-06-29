import { describe, expect, test } from 'vitest';
import {
  buildCountWhereQuery,
  buildCreateTableQuery,
  buildDeleteWhereQuery,
  buildFindWhereQuery,
  buildGeneralInsertManyQuery,
  buildGeneralInsertQuery,
  buildGetPageQuery,
  buildUpdateWhereQuery,
  Conditions,
} from './queryBuilder';
import { Modifier, notEquals } from './modifier';

describe('buildGeneralInsertQuery', () => {
  test('insert', () => {
    const actual = buildGeneralInsertQuery('INSERT', 'table', { a: 1, b: '' });

    expect(actual).toEqual('INSERT INTO "table" ("a","b") VALUES (?,?)');
  });

  test('insert or replace', () => {
    const actual = buildGeneralInsertQuery('INSERT OR REPLACE', 'table', {
      a: 1,
      b: '',
    });

    expect(actual).toEqual(
      'INSERT OR REPLACE INTO "table" ("a","b") VALUES (?,?)'
    );
  });

  test('insert returning', () => {
    const actual = buildGeneralInsertQuery(
      'INSERT',
      'table',
      { a: 1, b: '' },
      'b'
    );

    expect(actual).toEqual(
      'INSERT INTO "table" ("a","b") VALUES (?,?) RETURNING "b"'
    );
  });
});

describe('buildGeneralInsertManyQuery', () => {
  test('insert', () => {
    const actual = buildGeneralInsertManyQuery('INSERT', 'table', [
      { a: 1, b: '' },
      { a: 1, b: '' },
    ]);

    expect(actual).toEqual('INSERT INTO "table" ("a","b") VALUES (?,?),(?,?)');
  });

  test('insert or replace', () => {
    const actual = buildGeneralInsertManyQuery('INSERT OR REPLACE', 'table', [
      { a: 1, b: '' },
      { a: 1, b: '' },
    ]);

    expect(actual).toEqual(
      'INSERT OR REPLACE INTO "table" ("a","b") VALUES (?,?),(?,?)'
    );
  });

  test('insert returning', () => {
    const actual = buildGeneralInsertManyQuery(
      'INSERT',
      'table',
      [
        { a: 1, b: '' },
        { a: 1, b: '' },
      ],
      'b'
    );

    expect(actual).toEqual(
      'INSERT INTO "table" ("a","b") VALUES (?,?),(?,?) RETURNING "b"'
    );
  });
});

test.each<[Conditions<object>, ('a' | 'b')[] | '*', string]>([
  [{}, '*', 'SELECT * FROM "table"'],
  [{}, ['a'], 'SELECT "a" FROM "table"'],
  [{}, ['a', 'b'], 'SELECT "a","b" FROM "table"'],
  [{ a: 1 }, '*', 'SELECT * FROM "table" WHERE "a"=?'],
  [{ a: 1, b: 2 }, '*', 'SELECT * FROM "table" WHERE "a"=? AND "b"=?'],
  [
    { a: 1, b: notEquals(2) },
    '*',
    'SELECT * FROM "table" WHERE "a"=? AND "b"!=?',
  ],
])('buildFindWhereQuery', (conditions, fields, expected) => {
  const actual = buildFindWhereQuery<{ a: number; b: number }>(
    'table',
    conditions,
    fields
  );

  expect(actual).toEqual(expected);
});

type UpdateValue = { a?: number; b?: number; c?: number };

test.each<[keyof UpdateValue, UpdateValue, string]>([
  ['a', { b: 1 }, 'UPDATE "table" SET "b"=? WHERE "a"=?'],
  ['a', { b: 1, c: 2 }, 'UPDATE "table" SET "b"=?,"c"=? WHERE "a"=?'],
])('buildUpdateWhereQuery', (column, value, expected) => {
  const actual = buildUpdateWhereQuery('table', { [column]: 1 }, value);

  expect(actual).toEqual(expected);
});

test.each<['a', number | Modifier, string]>([
  ['a', 1, 'DELETE FROM "table" WHERE "a"=?'],
  ['a', notEquals(1), 'DELETE FROM "table" WHERE "a"!=?'],
])('buildDeleteWhereQuery', (column, value, expected) => {
  const actual = buildDeleteWhereQuery('table', { [column]: value });

  expect(actual).toEqual(expected);
});

test.each<[Conditions<unknown>, string]>([
  [{}, 'SELECT COUNT(*) as count FROM "table"'],
  [{ a: 1 }, 'SELECT COUNT(*) as count FROM "table" WHERE "a"=?'],
])('buildCountWhereQuery', (conditions, expected) => {
  const actual = buildCountWhereQuery('table', conditions);

  expect(actual).toBe(expected);
});

test.each<[number, number, Conditions<unknown>, string[] | '*', string]>([
  [0, 5, {}, '*', 'SELECT * FROM "table" LIMIT 5'],
  [1, 5, {}, ['a'], 'SELECT "a" FROM "table" LIMIT 5 OFFSET 1'],
  [
    1,
    5,
    { a: 5 },
    ['a', 'b'],
    'SELECT "a","b" FROM "table" WHERE "a"=? LIMIT 5 OFFSET 1',
  ],
])('buildGetPageQuery', (offset, count, conditions, fields, expected) => {
  const actual = buildGetPageQuery('table', offset, count, conditions, fields);

  expect(actual).toEqual(expected);
});

test('buildCreateTableQuery', () => {
  type Value = {
    a: number;
    b: string;
  };

  const actual = buildCreateTableQuery<Value>('table', {
    a: 'INTEGER',
    b: 'TEXT NOT NULL',
  });

  expect(actual).toEqual(
    'CREATE TABLE IF NOT EXISTS "table" ("a" INTEGER,"b" TEXT NOT NULL)'
  );
});
