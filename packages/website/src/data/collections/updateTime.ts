import { ClientSession, MongoClient } from 'mongodb';

import { UpdateTime, UpdateTimeType } from '../types/meta';

import { EntityCollection } from './base';

export class UpdateTimeCollection extends EntityCollection<UpdateTime> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'update-times');
  }

  async getByType(type: UpdateTimeType): Promise<number> {
    const value = await this.findOne({ type });

    return value?.time ?? 0;
  }

  async setByType(type: UpdateTimeType, time: number): Promise<void> {
    await this.updateOne({ type }, { $set: { type, time } }, { upsert: true });
  }
}
