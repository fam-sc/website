/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
import {
  Abortable,
  AggregateOptions,
  AnyBulkWriteOperation,
  BulkWriteOptions,
  ClientSession,
  Collection,
  Document,
  Filter,
  FindOptions,
  InferIdType,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
  WithId,
} from 'mongodb';

export class EntityCollection<T extends Document> {
  private client: MongoClient;
  protected session: ClientSession | undefined;
  private collectionName: string;

  constructor(
    client: MongoClient,
    session: ClientSession | undefined,
    collectionName: string
  ) {
    this.client = client;
    this.collectionName = collectionName;
    this.session = session;
  }

  protected collection(): Collection<T> {
    return this.client.db().collection(this.collectionName);
  }

  getAll() {
    return this.collection().find({}, this.options());
  }

  findById(id: InferIdType<T>): Promise<WithId<T> | null> {
    return this.collection().findOne({ _id: id } as Filter<T>, this.options());
  }

  insert(value: OptionalUnlessRequiredId<T>) {
    return this.collection().insertOne(value, this.options());
  }

  insertMany(values: OptionalUnlessRequiredId<T>[]) {
    return this.collection().insertMany(values, this.options());
  }

  count(): Promise<number> {
    return this.collection().countDocuments();
  }

  delete(id: ObjectId) {
    return this.collection().deleteOne(
      { _id: id } as Filter<T>,
      this.options()
    );
  }

  protected options() {
    return { session: this.session };
  }

  protected findOne(filter: Filter<T>, options?: FindOptions<T>) {
    return this.collection().findOne(filter, {
      ...options,
      session: this.session,
    });
  }

  protected bulkWrite(
    ops: readonly AnyBulkWriteOperation<T>[],
    options?: BulkWriteOptions
  ) {
    return this.collection().bulkWrite(ops, {
      ...options,
      session: this.session,
    });
  }

  protected updateOne(
    filter: Filter<T>,
    update: UpdateFilter<T> | Document[],
    options?: UpdateOptions
  ) {
    return this.collection().updateOne(filter, update, {
      ...options,
      session: this.session,
    });
  }

  protected find(filter: Filter<T>, options?: FindOptions & Abortable) {
    return this.collection().find(filter, {
      ...options,
      session: this.session,
    });
  }

  protected aggregate<T extends Document = Document>(
    pipeline: Document[],
    options?: AggregateOptions
  ) {
    return this.collection().aggregate<T>(pipeline, {
      ...options,
      session: this.session,
    });
  }
}
