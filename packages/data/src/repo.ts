import { D1Database, D1Result } from '@sc-fam/shared/cloudflare';
import { batchHelper, batchWithResultsHelper } from '@sc-fam/shared-sql/batch';
import {
  buildCreateTableQuery,
  DataQueryArray,
  TableDescriptor,
} from '@sc-fam/shared-sql/builder';
import { EntityCollectionClass } from '@sc-fam/shared-sql/collection';

import { AdminBotNewUserMessagesCollection } from './collections/adminBotNewUserMessages';
import { EventCollection } from './collections/events';
import { ForgotPasswordCollection } from './collections/forgotPasswords';
import { GalleryImageCollection } from './collections/galleryImages';
import { GlobalOptionsCollection } from './collections/globalOptions';
import { GroupCollection } from './collections/groups';
import { GuideCollection } from './collections/guides';
import { PendingUserCollection } from './collections/pendingUsers';
import { PollRespondentCollection } from './collections/pollRespondents';
import { PollCollection } from './collections/polls';
import { ScheduleCollection } from './collections/schedule';
import { ScheduleBotUserCollection } from './collections/scheduleBotUsers';
import { ScheduleLessonCollection } from './collections/scheduleLessons';
import { ScheduleTeacherCollection } from './collections/scheduleTeachers';
import { SessionCollection } from './collections/sessions';
import { UserCollection } from './collections/users';

const collectionTypes = [
  UserCollection,
  PendingUserCollection,
  EventCollection,
  GalleryImageCollection,
  SessionCollection,
  ScheduleCollection,
  ScheduleLessonCollection,
  ScheduleTeacherCollection,
  GroupCollection,
  PollCollection,
  PollRespondentCollection,
  ForgotPasswordCollection,
  AdminBotNewUserMessagesCollection,
  GuideCollection,
  ScheduleBotUserCollection,
  GlobalOptionsCollection,
];

export class Repository {
  private client: D1Database;
  private static defaultDatabase: D1Database | undefined;
  private collections: Map<EntityCollectionClass, unknown>;

  constructor(client: D1Database) {
    this.client = client;

    const collections = new Map<EntityCollectionClass, unknown>();
    const getCollection = <T>(type: EntityCollectionClass<T>) => {
      const result = collections.get(type);
      if (result === undefined) {
        throw new Error('Cannot find collection');
      }

      return result as T;
    };

    for (const collectionType of collectionTypes) {
      const collection = new collectionType(client);
      collection.getCollection = getCollection;

      collections.set(collectionType, collection);
    }

    this.collections = collections;
  }

  users = this.collection(UserCollection);
  pendingUsers = this.collection(PendingUserCollection);
  events = this.collection(EventCollection);
  galleryImages = this.collection(GalleryImageCollection);
  sessions = this.collection(SessionCollection);
  schedule = this.collection(ScheduleCollection);
  scheduleTeachers = this.collection(ScheduleTeacherCollection);
  groups = this.collection(GroupCollection);
  polls = this.collection(PollCollection);
  forgotPasswordEntries = this.collection(ForgotPasswordCollection);
  adminBotNewUserMessages = this.collection(AdminBotNewUserMessagesCollection);
  guides = this.collection(GuideCollection);
  scheduleBotUsers = this.collection(ScheduleBotUserCollection);
  globalOptions = this.collection(GlobalOptionsCollection);

  static async init(database: D1Database) {
    const tables: [string, TableDescriptor<unknown>][] = [];

    for (const collection of collectionTypes) {
      const descriptor = collection.descriptor();

      tables.push([collection.toString(), descriptor]);
    }

    for (const [name, descriptor] of tables) {
      await database.prepare(buildCreateTableQuery(name, descriptor)).run();
    }
  }

  private collection<T>(
    type: new (client: D1Database) => T
  ): (this: Repository) => T {
    return () => {
      const result = this.collections.get(type);
      if (result === undefined) {
        throw new Error('Cannot find collection');
      }

      return result as T;
    };
  }

  async batch<T extends unknown[]>(queries: DataQueryArray<T>): Promise<T> {
    return batchHelper(this.client, queries);
  }

  async batchWithResults<T extends unknown[]>(
    queries: DataQueryArray<T>
  ): Promise<[T, D1Result[]]> {
    return batchWithResultsHelper(this.client, queries);
  }

  static setDefaultDatabase(value: D1Database) {
    Repository.defaultDatabase = value;
  }

  async deleteAll() {
    for (const collection of this.collections.values()) {
      await (collection as UserCollection).deleteAll();
    }
  }

  static openConnection(database?: D1Database): Repository {
    const db = database ?? Repository.defaultDatabase;
    if (db === undefined) {
      throw new Error('No default database');
    }

    return new Repository(db);
  }
}
