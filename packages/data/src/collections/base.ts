/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
import {
  Abortable,
  AggregateOptions,
  AnyBulkWriteOperation,
  BulkWriteOptions,
  ClientSession,
  Collection,
  DeleteResult,
  Document,
  Filter,
  FindOptions,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
  UpdateResult,
  WithId,
} from 'mongodb';

export function resolveObjectId(value: string | ObjectId): ObjectId {
  return typeof value === 'string' ? new ObjectId(value) : value;
}

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

  findById(id: string | ObjectId): Promise<WithId<T> | null> {
    let objectId: ObjectId;

    try {
      objectId = resolveObjectId(id);
    } catch {
      return Promise.resolve(null);
    }

    return this.collection().findOne(
      { _id: objectId } as Filter<T>,
      this.options()
    );
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

  delete(id: string | ObjectId): Promise<DeleteResult> {
    let objectId: ObjectId;

    try {
      objectId = resolveObjectId(id);
    } catch {
      return Promise.resolve({ acknowledged: true, deletedCount: 0 });
    }

    return this.collection().deleteOne(
      { _id: objectId } as Filter<T>,
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

  protected updateById(
    id: string | ObjectId,
    update: UpdateFilter<T> | Document[],
    options?: UpdateOptions
  ): Promise<UpdateResult> {
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return Promise.resolve({
        acknowledged: true,
        matchedCount: 0,
        modifiedCount: 0,
        upsertedCount: 0,
        upsertedId: null,
      });
    }

    return this.updateOne({ _id: objectId } as Filter<T>, update, options);
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
