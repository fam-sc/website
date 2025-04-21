import { MongoClient } from 'mongodb';

import { Group } from '../types';

import { EntityCollection } from './base';

export class GroupCollection extends EntityCollection<Group> {
  constructor(client: MongoClient) {
    super(client, 'groups');
  }

  insertOrUpdateAll(groups: Group[]) {
    return this.collection().bulkWrite(
      groups.map(({ campusId, name }) => ({
        updateOne: {
          filter: { campusId },
          update: { $set: { campusId, name } },
          upsert: true,
        },
      }))
    );
  }
}
