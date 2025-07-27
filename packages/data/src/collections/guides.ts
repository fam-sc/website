import { RichTextString } from '@sc-fam/shared/richText/types.js';

import {
  buildCountWhereQuery,
  buildGetPageQuery,
} from '../sqlite/queryBuilder';
import { TableDescriptor } from '../sqlite/types';
import { Guide, RawGuide } from '../types';
import { EntityCollection } from './base';

function mapRawGuide(guide: RawGuide): Guide {
  return {
    ...guide,
    description: JSON.parse(guide.description),
    images: JSON.parse(guide.images),
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
      images: 'TEXT NOT NULL',
    };
  }

  update(id: number, { description, images, ...rest }: Partial<Guide>) {
    return this.updateWhere(
      { id },
      {
        description:
          description !== undefined ? JSON.stringify(description) : undefined,
        images: images !== undefined ? JSON.stringify(images) : undefined,
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
        images: JSON.stringify(images),
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
    const [count, guides] = await this.client.batch([
      this.client.prepare(buildCountWhereQuery('guides')),
      this.client.prepare(buildGetPageQuery('guides', index * size, size)),
    ]);

    return {
      total: (count.results[0] as { count: number }).count,
      items: guides.results.map((item) => mapRawGuide(item as RawGuide)),
    };
  }
}
