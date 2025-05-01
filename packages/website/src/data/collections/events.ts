import { ClientSession, MongoClient } from 'mongodb';

import { Event } from '../types';

import { EntityCollection } from './base';

export class EventCollection extends EntityCollection<Event> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'events');
  }
}
