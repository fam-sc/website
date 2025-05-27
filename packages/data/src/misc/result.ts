import { DeleteResult, Document, UpdateResult } from 'mongodb';

export function emptyUpdateResult<T extends Document>(): UpdateResult<T> {
  return {
    acknowledged: true,
    matchedCount: 0,
    modifiedCount: 0,
    upsertedCount: 0,
    upsertedId: null,
  };
}

export function emptyDeleteResult(): DeleteResult {
  return { acknowledged: true, deletedCount: 0 };
}
