import { ClientSession, MongoClient } from 'mongodb';

import { Group } from '../types';

import { EntityCollection } from './base';

export class GroupCollection extends EntityCollection<Group> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'groups');
  }

  insertOrUpdateAll(groups: Group[]) {
    return this.bulkWrite(
      groups.map(({ campusId, name }) => ({
        updateOne: {
          filter: { campusId },
          update: { $set: { campusId, name } },
          upsert: true,
        },
      }))
    );
  }

  findByCampusId(campusId: string) {
    return this.findOne({ campusId });
  }

  findByIds(ids: string[]) {
    return this.find({ campusId: { $in: ids } }).toArray();
  }

  groupExists(campusId: string): Promise<boolean> {
    return this.documentExists({ campusId });
  }
}
