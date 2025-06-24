import { describe, expect, test } from 'vitest';
import {
  buildCreateTableQuery,
  buildDeleteWhereQuery,
  buildFindWhereQuery,
  buildGeneralInsertManyQuery,
  buildGeneralInsertQuery,
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

test.each<[Conditions<unknown>, string]>([
  [{ a: 1 }, 'SELECT * FROM "table" WHERE "a"=?'],
  [{ a: 1, b: 2 }, 'SELECT * FROM "table" WHERE "a"=? AND "b"=?'],
  [{ a: 1, b: notEquals(2) }, 'SELECT * FROM "table" WHERE "a"=? AND "b"!=?'],
])('buildFindWhereQuery', (conditions, expected) => {
  const actual = buildFindWhereQuery('table', conditions);

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
