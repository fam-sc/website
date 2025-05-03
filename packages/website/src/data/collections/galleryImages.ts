import { ClientSession, MongoClient, ObjectId } from 'mongodb';

import { GalleryImage } from '../types';

import { EntityCollection } from './base';

export class GalleryImageCollection extends EntityCollection<GalleryImage> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'gallery-images');
  }

  async getPage(index: number, size: number) {
    const result = await this.aggregate([
      {
        $facet: {
          data: [{ $skip: index * size }, { $limit: size }],
        },
      },
      {
        $project: { data: { _id: 1 } },
      },
    ]).next();

    if (result === null) {
      return [];
    }

    return (result.data as { _id: ObjectId }[]).map(({ _id }) =>
      _id.toString()
    );
  }
}
