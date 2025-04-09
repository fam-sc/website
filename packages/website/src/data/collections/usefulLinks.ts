import { MongoClient } from 'mongodb';

import { UsefulLink } from '../types';

import { EntityCollection } from './base';

export class UsefulLinkCollection extends EntityCollection<UsefulLink> {
  constructor(client: MongoClient) {
    super(client, 'users');
  }
}
