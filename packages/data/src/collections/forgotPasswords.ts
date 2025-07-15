import { greaterOrEquals } from '../sqlite/modifier';
import { query } from '../sqlite/query';
import { TableDescriptor } from '../sqlite/types';
import { ForgotPasswordEntry } from '../types/user';
import { EntityCollection } from './base';

export class ForgotPasswordCollection extends EntityCollection<ForgotPasswordEntry>(
  'forgot_password_entries'
) {
  static descriptor(): TableDescriptor<ForgotPasswordEntry> {
    return {
      token: 'TEXT NOT NULL PRIMARY KEY',
      email: 'TEXT NOT NULL',
      expirationDate: 'INTEGER NOT NULL',
    };
  }

  updatePasswordByToken(
    token: string,
    password: string,
    expirationDate: number
  ) {
    return query
      .first(
        this.client
          .prepare(
            `UPDATE users as u
SET passwordHash=?
FROM (SELECT email, token, expirationDate FROM forgot_password_entries) as e
WHERE e.token = ? AND e.expirationDate >= ?`
          )
          .bind(password, token, expirationDate)
      )
      .map((_, [result]) => {
        return { changes: result.meta.changes };
      });
  }

  deleteByToken(token: string) {
    return this.deleteWhere({ token });
  }

  async tokenExistsAndNotExpired(
    token: string,
    expirationDate: number
  ): Promise<boolean> {
    const count = await this.count({
      token,
      expirationDate: greaterOrEquals(expirationDate),
    }).get();

    return count > 0;
  }
}
