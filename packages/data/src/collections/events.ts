import { ClientSession, MongoClient, UpdateResult, WithId } from 'mongodb';

import { Event } from '../types';

import { EntityCollection } from './base';
import { pagination } from '../misc/pagination';
import { RichTextString } from '@shared/richText/types';

export class EventCollection extends EntityCollection<Event> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'events');
  }

  update(id: string, value: Partial<Event>): Promise<UpdateResult> {
    return this.updateById(id, { $set: value });
  }

  async getDescriptionById(id: string): Promise<RichTextString | null> {
    const result = await this.findById(id, { projection: { description: 1 } });

    return result?.description ?? null;
  }

  async getLatestEvents(n: number): Promise<WithId<Event>[]> {
    const result = await this.aggregate<{ data: WithId<Event>[] }>([
      {
        $sort: {
          date: -1,
        },
      },
      {
        $facet: {
          data: [{ $limit: n }],
        },
      },
    ]).next();

    return result?.data ?? [];
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
