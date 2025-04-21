import { MongoClient } from 'mongodb';

import { ScheduleTeacher } from '../types/schedule';

import { EntityCollection } from './base';

export class ScheduleTeacherCollection extends EntityCollection<ScheduleTeacher> {
  constructor(client: MongoClient) {
    super(client, 'schedule_teachers');
  }

  insertOrUpdate({ name, link }: ScheduleTeacher) {
    return this.collection().updateOne(
      { name },
      { $set: { name, link } },
      { upsert: true }
    );
  }

  findByName(name: string) {
    return this.collection().findOne({ name });
  }
}
