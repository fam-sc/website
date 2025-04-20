import { Knex } from 'knex';

import { Step } from '../types';

import { EntityRepository, upsertBase } from './base';

import { without } from '@/utils/object';

export class StepRepository extends EntityRepository<Step> {
  constructor(knex: Knex) {
    super(knex, 'dbo.step');
  }

  getAll(): Promise<Step[]> {
    return this.table();
  }

  insert(values: Step[]): Promise<string[]> {
    return this.table().insert(
      values.map((value) => ({ ...value, id: this.knex.fn.uuid() })),
      'id'
    );
  }

  update(value: Step): Promise<number> {
    return this.table().where('id', value.id).update(without(value, 'id'));
  }

  upsert(values: Step[]): Promise<Record<string, string>> {
    return upsertBase(
      values,
      () => this.table().select(['id']),
      (steps) => this.insert(steps),
      (step) => this.update(step)
    );
  }
}
