import { ImageSize } from '@sc-fam/shared/image';
import { RichTextString } from '@sc-fam/shared/richText';

import { TableDescriptor } from '../sqlite/types';
import { Guide, RawGuide } from '../types';
import { EntityCollection } from './base';

function mapImages<E extends null | undefined>(
  images: ImageSize[] | E
): string | E {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (images === undefined || images === null) {
    return images;
  }

  return JSON.stringify(images);
}

function mapRawGuide(guide: RawGuide): Guide {
  return {
    ...guide,
    description: JSON.parse(guide.description),
    images: guide.images !== null ? JSON.parse(guide.images) : null,
  };
}

export class GuideCollection extends EntityCollection<RawGuide>('guides') {
  static descriptor(): TableDescriptor<RawGuide> {
    return {
      id: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
      description: 'TEXT NOT NULL',
      title: 'TEXT NOT NULL',
      createdAtDate: 'INTEGER NOT NULL',
      updatedAtDate: 'INTEGER NOT NULL',
      images: 'TEXT',
    };
  }

  update(id: number, { description, images, ...rest }: Partial<Guide>) {
    return this.updateWhere(
      { id },
      {
        description:
          description !== undefined ? JSON.stringify(description) : undefined,
        images: mapImages(images),
        ...rest,
      }
    );
  }

  insertGuide({
    description,
    images,
    ...rest
  }: Omit<Guide, 'id'>): Promise<number> {
    return this.insert(
      {
        description: JSON.stringify(description),
        images: mapImages(images),
        ...rest,
      },
      'id'
    );
  }

  async findById(id: number) {
    const result = await this.findOneWhere({ id });

    return result ? mapRawGuide(result) : null;
  }

  async getDescriptionById(id: number): Promise<RichTextString | null> {
    const result = await this.findOneWhere({ id }, ['description']);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result !== null ? JSON.parse(result.description) : null;
  }

  async getPage(index: number, size: number) {
    const { total, items } = await this.getPageWithTotalSize(index, size, {
      key: 'createdAtDate',
      type: 'DESC',
    });

    return {
      total,
      items: items.map((item) => mapRawGuide(item)),
    };
  }
}
