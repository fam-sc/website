import { MongoClient } from 'mongodb';

import { UpdateTime, UpdateTimeType } from '../types/meta';

import { EntityCollection } from './base';

export class UpdateTimeCollection extends EntityCollection<UpdateTime> {
  constructor(client: MongoClient) {
    super(client, 'update-times');
  }

  async getByType(type: UpdateTimeType): Promise<number> {
    const value = await this.collection().findOne({ type });

    return value?.time ?? 0;
  }

  async setByType(type: UpdateTimeType, time: number): Promise<void> {
    await this.collection().updateOne(
      { type },
      { $set: { type, time } },
      { upsert: true }
    );
  }
}
