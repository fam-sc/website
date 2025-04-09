import {
  Collection,
  Document,
  MongoClient,
  OptionalUnlessRequiredId,
} from 'mongodb';

export class EntityCollection<T extends Document> {
  private client: MongoClient;
  private collectionName: string;

  constructor(client: MongoClient, collectionName: string) {
    this.client = client;
    this.collectionName = collectionName;
  }

  private collection(): Collection<T> {
    return this.client.db().collection(this.collectionName);
  }

  getAll() {
    return this.collection().find().stream();
  }

  async insert(value: OptionalUnlessRequiredId<T>) {
    await this.collection().insertOne(value);
  }
}
