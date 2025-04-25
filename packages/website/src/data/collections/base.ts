import {
  Collection,
  Document,
  Filter,
  InferIdType,
  MongoClient,
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

  protected collection(): Collection<T> {
    return this.client.db().collection(this.collectionName);
  }

  getAll() {
    return this.collection().find();
  }

  findById(id: InferIdType<T>): Promise<WithId<T> | null> {
    return this.collection().findOne({ _id: id } as Filter<T>);
  }

  insert(value: OptionalUnlessRequiredId<T>) {
    return this.collection().insertOne(value);
  }
}
