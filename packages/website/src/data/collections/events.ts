import { ClientSession, MongoClient, ObjectId, WithId } from 'mongodb';

import { Event } from '../types';

import { EntityCollection } from './base';
import { pagination } from '../misc/pagination';

export class EventCollection extends EntityCollection<Event> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'events');
  }

  update(id: string, value: Event) {
    return this.updateOne({ _id: new ObjectId(id) }, { $set: value });
  }
  
  async getPage(index: number, size: number) {
    const result = await this.aggregate([
      {
        $sort: {
          date: -1,
        },
      },
      pagination(index, size),
    ]).next();

    if (result === null) {
      return { total: 0, items: [] };
    }

    return {
      total: result.metadata[0].totalCount as number,
      items: result.data as WithId<Event>[],
    };
  }
}
