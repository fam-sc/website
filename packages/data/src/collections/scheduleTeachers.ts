import { ClientSession, MongoClient } from 'mongodb';

import { ScheduleTeacher } from '../types/schedule';

import { EntityCollection } from './base';

export class ScheduleTeacherCollection extends EntityCollection<ScheduleTeacher> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'schedule_teachers');
  }

  insertOrUpdate({ name, link }: ScheduleTeacher) {
    return this.updateOne({ name }, { $set: { name, link } }, { upsert: true });
  }

  insertOrUpdateMany(items: ScheduleTeacher[]) {
    return this.bulkWrite(
      items.map(({ name, link }) => ({
        updateOne: {
          filter: { name },
          update: { $set: { name, link } },
          upsert: true,
        },
      }))
    );
  }

  findByName(name: string) {
    return this.findOne({ name });
  }

  findByNames(names: string[]) {
    return this.find({ name: { $in: names } });
  }
}
