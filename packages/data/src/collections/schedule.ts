import { ClientSession, MongoClient } from 'mongodb';

import { Schedule, ScheduleWithTeachers } from '../types/schedule';

import { EntityCollection } from './base';

export class ScheduleCollection extends EntityCollection<Schedule> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'schedule');
  }

  findByGroup(groupCampusId: string): Promise<Schedule | null> {
    return this.findOne({ groupCampusId });
  }

  findByGroupWithTeachers(
    groupCampusId: string
  ): Promise<ScheduleWithTeachers | null> {
    return this.aggregate<ScheduleWithTeachers>([
      { $match: { groupCampusId } },
      {
        $lookup: {
          from: 'schedule_teachers',
          foreignField: 'name',
          localField: 'weeks.days.lessons.teacher',
          as: 'teachers',
        },
      },
      {
        $project: { 'teachers._id': 0 },
      },
    ]).next();
  }

  upsertWeeks({ groupCampusId, weeks }: Schedule) {
    return this.updateOne(
      { groupCampusId },
      { $set: { groupCampusId, weeks } },
      { upsert: true }
    );
  }

  updateLinks(groupCampusId: string, links: Schedule['links']) {
    return this.updateOne({ groupCampusId }, { $set: { links } });
  }

  async getLinks(groupCampusId: string): Promise<Schedule['links'] | null> {
    const result = await this.findOne<Pick<Schedule, 'links'>>(
      { groupCampusId },
      { projection: { links: 1 } }
    );

    return result?.links ?? null;
  }

  findSchedulesWithGroupIds(ids: string[]) {
    return this.find({ groupCampusId: { $in: ids } });
  }
}
