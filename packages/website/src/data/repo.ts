import { MongoClient } from 'mongodb';

import { EventCollection } from './collections/events';
import { GalleryImageCollection } from './collections/galleryImages';
import { SessionCollection } from './collections/sessions';
import { UsefulLinkCollection } from './collections/usefulLinks';
import { UserCollection } from './collections/users';

import { getEnvChecked } from '@/utils/env';

export class Repository implements AsyncDisposable {
  private client: MongoClient;

  constructor(client: MongoClient) {
    this.client = client;
  }

  users(): UserCollection {
    return new UserCollection(this.client);
  }

  events(): EventCollection {
    return new EventCollection(this.client);
  }

  galleryImages(): GalleryImageCollection {
    return new GalleryImageCollection(this.client);
  }

  usefulLinks(): UsefulLinkCollection {
    return new UsefulLinkCollection(this.client);
  }

  sessions(): SessionCollection {
    return new SessionCollection(this.client);
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.client.close();
  }

  static async openConnection(): Promise<Repository> {
    const connectionString = getEnvChecked('MONGO_CONNECTION_STRING');
    const client = new MongoClient(connectionString);
    await client.connect();

    return new Repository(client);
  }
}
