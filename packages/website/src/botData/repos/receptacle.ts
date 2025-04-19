import { Knex } from 'knex';

import { Receptacle } from '../types';

import { EntityRepository, upsertBase } from './base';

import { without } from '@/utils/object';

export class ReceptacleRepository extends EntityRepository<Receptacle> {
  constructor(knex: Knex) {
    super(knex, 'dbo.receptacle');
  }

  getAll(): Promise<Receptacle[]> {
    return this.table();
  }

  insert(values: Receptacle[]): Promise<string[]> {
    return this.table().insert(
      values.map((value) => ({ ...value, id: this.knex.fn.uuid() })),
      'id',
    );
  }

  update(value: Receptacle): Promise<number> {
    return this.table().where('id', value.id).update(without(value, 'id'));
  }

  upsert(values: Receptacle[]): Promise<Record<string, string>> {
    return upsertBase(
      values,
      () => this.table().select(['id']),
      (steps) => this.insert(steps),
      (step) => this.update(step),
    );
  }
}
