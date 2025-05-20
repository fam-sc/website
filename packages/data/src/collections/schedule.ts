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

  upsert({ groupCampusId, weeks }: Schedule) {
    return this.updateOne(
      { groupCampusId },
      { $set: { groupCampusId, weeks } },
      { upsert: true }
    );
  }

  update({ groupCampusId, weeks }: Schedule) {
    return this.updateOne({ groupCampusId }, { $set: { weeks } });
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
