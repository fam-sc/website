import {
  Collection,
  Document,
  Filter,
  InferIdType,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
  WithId,
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

  findById(id: InferIdType<T>): Promise<WithId<T> | null> {
    return this.collection().findOne({ _id: new ObjectId(id) } as Filter<T>);
  }

  async insert(value: OptionalUnlessRequiredId<T>) {
    await this.collection().insertOne(value);
  }
}
