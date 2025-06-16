/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
import {
  Abortable,
  AggregateOptions,
  AnyBulkWriteOperation,
  BulkWriteOptions,
  ClientSession,
  Collection,
  DeleteOptions,
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
import { emptyDeleteResult, emptyUpdateResult } from '../misc/result';

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

  findById<R = T>(
    id: string | ObjectId,
    options?: FindOptions<T>
  ): Promise<WithId<R> | null> {
    let objectId: ObjectId;

    try {
      objectId = resolveObjectId(id);
    } catch {
      return Promise.resolve(null);
    }

    return this.collection().findOne<WithId<R>>(
      { _id: objectId } as Filter<T>,
      {
        ...options,
        session: this.session,
      }
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
      return Promise.resolve(emptyDeleteResult());
    }

    return this.deleteOne({ _id: objectId } as Filter<T>);
  }

  deleteOne(filter: Filter<T>, options?: DeleteOptions) {
    return this.collection().deleteOne(filter, {
      session: this.session,
      ...options,
    });
  }

  protected options() {
    return { session: this.session };
  }

  protected findOne<R = WithId<T>>(
    filter: Filter<T>,
    options?: FindOptions<T>
  ) {
    return this.collection().findOne<R>(filter, {
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

  protected updateMany(
    filter: Filter<T>,
    update: UpdateFilter<T> | Document[],
    options?: UpdateOptions
  ) {
    return this.collection().updateMany(filter, update, {
      ...options,
      session: this.session,
    });
  }

  protected updateById(
    id: string | ObjectId,
    update: UpdateFilter<T> | Document[],
    options?: UpdateOptions
  ): Promise<UpdateResult<T>> {
    let objectId: ObjectId;
    try {
      objectId = resolveObjectId(id);
    } catch {
      return Promise.resolve(emptyUpdateResult());
    }

    return this.updateOne({ _id: objectId } as Filter<T>, update, {
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

  protected async documentExists(filter: Filter<T>): Promise<boolean> {
    const result = await this.collection().countDocuments(
      filter,
      this.options()
    );

    return result > 0;
  }
}
