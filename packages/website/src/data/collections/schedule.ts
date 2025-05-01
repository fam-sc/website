import { ClientSession, MongoClient } from 'mongodb';

import { Schedule } from '../types/schedule';

import { EntityCollection } from './base';

export class ScheduleCollection extends EntityCollection<Schedule> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'schedule');
  }

  findByGroup(groupCampusId: string): Promise<Schedule | null> {
    return this.findOne({ groupCampusId });
  }

  upsert({ groupCampusId, firstWeek, secondWeek }: Schedule) {
    return this.updateOne(
      { groupCampusId },
      { $set: { groupCampusId, firstWeek, secondWeek } },
      { upsert: true }
    );
  }
}
