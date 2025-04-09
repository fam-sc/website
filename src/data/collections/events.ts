import { MongoClient } from 'mongodb';

import { Event } from '../types';

import { EntityCollection } from './base';

export class EventCollection extends EntityCollection<Event> {
  constructor(client: MongoClient) {
    super(client, 'events');
  }
}
