import { ClientSession, MongoClient, ObjectId } from 'mongodb';

import { Event } from '../types';

import { EntityCollection } from './base';

export class EventCollection extends EntityCollection<Event> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'events');
  }

  update(id: string, value: Event) {
    return this.updateOne({ _id: new ObjectId(id) }, { $set: value });
  }
}
