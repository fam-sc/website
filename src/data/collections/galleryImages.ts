import { MongoClient } from 'mongodb';

import { GalleryImage } from '../types';

import { EntityCollection } from './base';

export class GalleryImageCollection extends EntityCollection<GalleryImage> {
  constructor(client: MongoClient) {
    super(client, 'users');
  }
}
