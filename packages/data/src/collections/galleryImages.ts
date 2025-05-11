import { ClientSession, MongoClient, ObjectId, WithId } from 'mongodb';

import { Event, GalleryImage, ImageInfo } from '../types';

import { EntityCollection } from './base';

export class GalleryImageCollection extends EntityCollection<GalleryImage> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'gallery-images');
  }

  async getGalleryImageWithEvent(id: ObjectId) {
    const result = await this.aggregate<
      WithId<GalleryImage> & { event: [WithId<Event>] | [] }
    >([
      {
        $match: { _id: id },
      },
      {
        $lookup: {
          from: 'events',
          foreignField: '_id',
          localField: 'eventId',
          as: 'event',
        },
      },
    ]).next();

    return result === null
      ? null
      : { ...result, event: result.event[0] ?? null };
  }

  async getPage(index: number, size: number) {
    const result = await this.aggregate<{
      data: { _id: ObjectId; image?: ImageInfo }[];
    }>([
      {
        $sort: {
          date: -1,
          order: 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: index * size }, { $limit: size }],
        },
      },
      {
        $project: { data: { _id: 1, image: 1 } },
      },
    ]).next();

    if (result === null) {
      return [];
    }

    return result.data.map(({ _id, image }) => ({
      id: _id.toString(),
      width: image?.width,
      height: image?.height,
    }));
  }
}
