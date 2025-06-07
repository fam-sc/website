import { ClientSession, MongoClient } from 'mongodb';

import { EventCollection } from './collections/events';
import { GalleryImageCollection } from './collections/galleryImages';
import { GroupCollection } from './collections/groups';
import { ScheduleCollection } from './collections/schedule';
import { ScheduleTeacherCollection } from './collections/scheduleTeachers';
import { SessionCollection } from './collections/sessions';
import { UpdateTimeCollection } from './collections/updateTime';
import { UserCollection } from './collections/users';

import { getEnvChecked } from '@shared/env';
import { PollCollection } from './collections/polls';
import { PendingUserCollection } from './collections/pendingUsers';

export class Repository implements AsyncDisposable {
  private client: MongoClient;
  private session: ClientSession | undefined;
  private static defaultConnectionString: string | undefined;

  constructor(client: MongoClient, session?: ClientSession) {
    this.client = client;
    this.session = session;
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

  async transaction<R>(block: (trepo: Repository) => Promise<R>): Promise<R> {
    const session = this.client.startSession();

    try {
      return await session.withTransaction(() =>
        block(new Repository(this.client, session))
      );
    } finally {
      await session.endSession();
    }
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.client.close();
  }

  private collection<T>(
    type: new (client: MongoClient, session: ClientSession | undefined) => T
  ): (this: Repository) => T {
    return () => {
      return new type(this.client, this.session);
    };
  }

  static setDefaultConnectionString(value: string) {
    Repository.defaultConnectionString = value;
  }

  static async openConnection(connectionString?: string): Promise<Repository> {
    const client = new MongoClient(
      connectionString ??
        Repository.defaultConnectionString ??
        getEnvChecked('MONGO_CONNECTION_STRING')
    );
    await client.connect();

    return new Repository(client);
  }
}
