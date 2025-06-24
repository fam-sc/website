import { TableDescriptor } from '../sqlite/types';
import { GalleryImage, GalleryImageWithEvent, RawGalleryImage } from '../types';

import { EntityCollection } from './base';
import { ImageSize } from '@shared/image/types';

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
      'gallery_images.date': number;
      'events.id': number;
      'events.title': string;
    }>(
      `SELECT gallery_images.date, events.id, events.title 
      FROM gallery_images 
      INNER JOIN events ON events.id=gallery_images.id 
      WHERE gallery_images.id=?`
    );

    return (
      result && {
        id,
        date: result['gallery_images.date'],
        event: {
          id: result['events.id'],
          title: result['events.title'],
        },
      }
    );
  }

  async getPage(index: number, size: number) {
    const result = await this.selectAll<{ id: number; images: string }>(
      `SELECT id, images FROM gallery_images OFFSET ${index * size} LIMIT ${size}`
    );

    return result.map(({ id, images }) => ({ id, images: JSON.parse(images) }));
  }

  async getImageSizes(id: number): Promise<ImageSize[] | null> {
    const result = await this.findOneWhere({ id }, ['images']);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result ? JSON.parse(result.images) : null;
  }
}
