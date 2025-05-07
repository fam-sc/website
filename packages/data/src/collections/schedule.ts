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

  update({ groupCampusId, firstWeek, secondWeek }: Schedule) {
    return this.updateOne(
      { groupCampusId },
      { $set: { firstWeek, secondWeek } }
    );
  }

  updateLinks(
    groupId: string,
    links: { type: string; name: string; teacher: string; link: string }[]
  ) {
    return this.bulkWrite(
      links.map(({ type, name, teacher, link }) => ({
        updateMany: {
          filter: { groupCampusId: groupId, type, name, teacher },
          update: { $set: { link } },
        },
      }))
    );
  }

  findSchedulesWithGroupIds(ids: string[]) {
    return this.find({ groupCampusId: { $in: ids } });
  }
}
