import { ClientSession, MongoClient, ObjectId, WithId } from 'mongodb';

import { Event, GalleryImage } from '../types';

import { EntityCollection } from './base';
import { ImageSize } from '@shared/image/types';

export class GalleryImageCollection extends EntityCollection<GalleryImage> {
  constructor(client: MongoClient, session?: ClientSession) {
    super(client, session, 'gallery-images');
  }

  update(id: string, value: Partial<GalleryImage>) {
    return this.updateById(id, { $set: value });
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
      data: { _id: ObjectId; images: ImageSize[] }[];
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
        $project: { data: { _id: 1, images: 1 } },
      },
    ]).next();

    if (result === null) {
      return [];
    }

    return result.data.map(({ _id, images: sizes }) => ({
      id: _id.toString(),
      sizes,
    }));
  }

  async getImageSizes(id: string): Promise<ImageSize[] | null> {
    const result = await this.findById<{ images: ImageSize[] }>(id, {
      projection: { images: 1 },
    });

    return result?.images ?? null;
  }
}
