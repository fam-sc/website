import { EventCollection } from './collections/events';
import { GalleryImageCollection } from './collections/galleryImages';
import { GroupCollection } from './collections/groups';
import { ScheduleCollection } from './collections/schedule';
import { ScheduleTeacherCollection } from './collections/scheduleTeachers';
import { SessionCollection } from './collections/sessions';
import { UpdateTimeCollection } from './collections/updateTime';
import { UserCollection } from './collections/users';

import { PollCollection } from './collections/polls';
import { PendingUserCollection } from './collections/pendingUsers';
import { D1Database } from '@shared/cloudflare/d1/types';
import { TableDescriptor } from './sqlite/types';
import { buildCreateTableQuery } from './sqlite/queryBuilder';
import { DataQuery } from './sqlite/query';

export class Repository {
  private client: D1Database;
  private static defaultDatabase: D1Database | undefined;

  constructor(client: D1Database) {
    this.client = client;
  }

  users = this.collection(UserCollection);
  pendingUsers = this.collection(PendingUserCollection);
  events = this.collection(EventCollection);
  galleryImages = this.collection(GalleryImageCollection);
  sessions = this.collection(SessionCollection);
  schedule = this.collection(ScheduleCollection);
  scheduleTeachers = this.collection(ScheduleTeacherCollection);
  updateTime = this.collection(UpdateTimeCollection);
  groups = this.collection(GroupCollection);
  polls = this.collection(PollCollection);

  static async init(database: D1Database) {
    const tables: [string, TableDescriptor<unknown>][] = [];
    const collections = [
      UserCollection,
      PendingUserCollection,
      EventCollection,
      GalleryImageCollection,
      SessionCollection,
      ScheduleCollection,
      ScheduleTeacherCollection,
      UpdateTimeCollection,
      GroupCollection,
    ];

    for (const collection of collections) {
      const descriptor = collection.descriptor();

      if (Array.isArray(descriptor)) {
        tables.push(...descriptor);
      } else {
        tables.push([collection.toString(), descriptor]);
      }
    }

    for (const [name, descriptor] of tables) {
      await database.prepare(buildCreateTableQuery(name, descriptor)).run();
    }
  }

  private collection<T>(
    type: new (client: D1Database) => T
  ): (this: Repository) => T {
    return () => {
      return new type(this.client);
    };
  }

  async batch<T extends unknown[]>(queries: {
    [K in keyof T]: DataQuery<T[K]>;
  }): Promise<T> {
    const results = await this.client.batch(
      queries.flatMap(({ statements }) => statements)
    );

    let resultOffset = 0;
    return queries.map((query) => {
      const part = results.slice(
        resultOffset,
        resultOffset + query.statements.length
      );
      resultOffset += query.statements.length;

      return query.mapResult(part);
    }) as T;
  }

  static setDefaultDatabase(value: D1Database) {
    Repository.defaultDatabase = value;
  }

  static openConnection(database?: D1Database): Repository {
    const db = database ?? Repository.defaultDatabase;
    if (db === undefined) {
      throw new Error('No default database');
    }

    return new Repository(db);
  }
}
