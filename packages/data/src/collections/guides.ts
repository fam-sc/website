import { RichTextString } from '@sc-fam/shared/richText';
import { Conditions, TableDescriptor } from '@sc-fam/shared-sql/builder';
import { EntityCollection } from '@sc-fam/shared-sql/collection';

import { Guide, ImageData, RawGuide } from '../types';

function mapImageData<E extends null | undefined>(
  images: ImageData | E
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
      slug: 'TEXT NOT NULL',
    };
  }

  update(id: number, { description, images, ...rest }: Partial<Guide>) {
    return this.updateWhere(
      { id },
      {
        description:
          description !== undefined ? JSON.stringify(description) : undefined,
        images: mapImageData(images),
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
        images: mapImageData(images),
        ...rest,
      },
      'id'
    );
  }

  private async findBy(filter: Conditions<RawGuide>) {
    const result = await this.findOneWhere(filter);

    return result ? mapRawGuide(result) : null;
  }

  findById(id: number) {
    return this.findBy({ id });
  }

  findBySlug(slug: string) {
    return this.findBy({ slug });
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
