import { MongoClient } from 'mongodb';

import { Schedule } from '../types/schedule';

import { EntityCollection } from './base';

export class ScheduleCollection extends EntityCollection<Schedule> {
  constructor(client: MongoClient) {
    super(client, 'schedule');
  }

  findByGroup(groupCampusId: string): Promise<Schedule | null> {
    return this.collection().findOne({ groupCampusId });
  }

  upsert({ groupCampusId, firstWeek, secondWeek }: Schedule) {
    return this.collection().updateOne(
      { groupCampusId },
      { $set: { groupCampusId, firstWeek, secondWeek } },
      { upsert: true }
    );
  }
}
