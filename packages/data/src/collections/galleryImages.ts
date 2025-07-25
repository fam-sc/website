import { ImageSize } from '@sc-fam/shared/image';

import { TableDescriptor } from '../sqlite/types';
import {
  GalleryImage,
  GalleryImageWithEvent,
  RawGalleryImage,
} from '../types/common';
import { EntityCollection } from './base';

export class GalleryImageCollection extends EntityCollection<RawGalleryImage>(
  'gallery_images'
) {
  static descriptor(): TableDescriptor<RawGalleryImage> {
    return {
      id: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
      date: 'INTEGER NOT NULL',
      eventId: 'INTEGER',
      images: 'TEXT NOT NULL',
      order: 'INTEGER NOT NULL',
    };
  }

  update(id: number, { images, ...rest }: Partial<GalleryImage>) {
    return this.updateWhere(
      { id },
      images ? { images: JSON.stringify(images), ...rest } : rest
    );
  }

  async getGalleryImageWithEvent(
    id: number
  ): Promise<GalleryImageWithEvent | null> {
    const result = await this.selectOne<{
      galleryDate: number;
      eventId: number;
      eventTitle: string;
    }>(
      `SELECT gallery_images.date as galleryDate, events.id as eventId, events.title as eventTitle 
      FROM gallery_images 
      INNER JOIN events ON events.id=gallery_images.id 
      WHERE gallery_images.id=?`
    );

    return (
      result && {
        id,
        date: result.galleryDate,
        event: {
          id: result.eventId,
          title: result.eventTitle,
        },
      }
    );
  }

  async getPage(index: number, size: number) {
    const result = await this.getPageBase(index * size, size, {}, [
      'id',
      'images',
    ]).get();

    return result.map(({ id, images }) => ({
      id,
      images: JSON.parse(images) as ImageSize[],
    }));
  }

  async getImageSizes(id: number): Promise<ImageSize[] | null> {
    const result = await this.findOneWhere({ id }, ['images']);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result ? JSON.parse(result.images) : null;
  }
}
