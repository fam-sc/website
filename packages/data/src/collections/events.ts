import { TableDescriptor } from '../sqlite/types';
import { Event, RawEvent } from '../types';

import { EntityCollection } from './base';
import { RichTextString } from '@shared/richText/types';

function mapRawEvent(event: RawEvent): Event {
  return {
    ...event,
    description: JSON.parse(event.description),
    images: JSON.parse(event.images),
  };
}

export class EventCollection extends EntityCollection<RawEvent>('events') {
  static descriptor(): TableDescriptor<RawEvent> {
    return {
      id: 'INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
      date: 'INTEGER NOT NULL',
      description: 'TEXT NOT NULL',
      status: 'INTEGER NOT NULL',
      title: 'TEXT NOT NULL',
      images: 'TEXT NOT NULL',
    };
  }

  update(id: number, { description, images, ...rest }: Partial<Event>) {
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

  insertEvent({
    description,
    images,
    ...rest
  }: Omit<Event, 'id'>): Promise<number> {
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

    return result ? mapRawEvent(result) : null;
  }

  async getDescriptionById(id: number): Promise<RichTextString | null> {
    const result = await this.findOneWhere({ id }, ['description']);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result !== null ? JSON.parse(result.description) : null;
  }

  getAllShortEvents() {
    return this.all(['id', 'title']).get();
  }

  async getLatestEvents(n: number): Promise<Event[]> {
    const result = await this.selectAll(
      `SELECT * FROM events ORDER BY date DESC LIMIT ${n}`
    );

    return result.map((item) => mapRawEvent(item));
  }

  async getPage(index: number, size: number) {
    const [count, events] = await this.client.batch([
      this.client.prepare('SELECT COUNT(*) as count FROM events'),
      this.client.prepare(
        `SELECT * FROM events OFFSET ${index * size} LIMIT ${size}`
      ),
    ]);

    return {
      total: (count.results[0] as { count: number }).count,
      items: events.results.map((item) => mapRawEvent(item as RawEvent)),
    };
  }
}
