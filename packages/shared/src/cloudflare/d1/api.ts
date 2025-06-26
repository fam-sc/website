import {
  D1Result,
  D1PreparedStatement,
  D1Database,
  D1ExecResult,
} from './types';

type D1Response<T> = { result: D1Result<T>[] };

interface ExtendedD1Statement extends D1PreparedStatement {
  readonly sql: string;
  readonly bindings: unknown[] | undefined;
}

function notImplemented(): never {
  throw new Error('Not implemented');
}

export class ApiD1Database implements D1Database {
  private token: string;
  private account: string;
  private dbId: string;

  constructor(token: string, account: string, dbId: string) {
    this.token = token;
    this.account = account;
    this.dbId = dbId;
  }

  private async doQuery<T>(
    sql: string,
    bindings: unknown[]
  ): Promise<D1Result<T>> {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.account}/d1/database/${this.dbId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql,
          params: bindings,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `${response.statusText}: ${await response.text()} when executing ${sql}`
      );
    }

    const responseContent = (await response.json()) as D1Response<T>;

    return responseContent.result[0];
  }

  private createStatement(
    sql: string,
    bindings?: unknown[]
  ): D1PreparedStatement {
    // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
    const database = this;

    const statement: ExtendedD1Statement = {
      sql,
      bindings,
      bind(...values) {
        return database.createStatement(sql, values);
      },
      run<T>(): Promise<D1Result<T>> {
        return database.doQuery(sql, bindings ?? []);
      },
      async all<T>(): Promise<D1Result<T>> {
        return database.doQuery(sql, bindings ?? []);
      },
      async first() {
        const { results } = await database.doQuery(sql, bindings ?? []);

        return results[0] ?? null;
      },
      raw: notImplemented,
    };

    return statement;
  }

  async exec(query: string): Promise<D1ExecResult> {
    await this.doQuery(query, []);

    return { count: 0, duration: 0 };
  }

  async batch<T>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    const results = await Promise.all(
      statements.map((statement) => {
        const { sql, bindings } = statement as ExtendedD1Statement;

        return this.doQuery(sql, bindings ?? []);
      })
    );

    return results as D1Result<T>[];
  }

  prepare(query: string): D1PreparedStatement {
    return this.createStatement(query, []);
  }

  withSession = notImplemented;
  dump = notImplemented;
}
