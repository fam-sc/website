import { Knex } from 'knex';

import { AnswerOption } from '../types';

import { EntityRepository, upsertBase } from './base';

import { without } from '@/utils/object';

export class AnswerOptionRepository extends EntityRepository<AnswerOption> {
  constructor(knex: Knex) {
    super(knex, 'dbo.answer_option');
  }

  getAll(): Promise<AnswerOption[]> {
    return this.table();
  }

  insert(values: AnswerOption[]): Promise<string[]> {
    return this.table().insert(
      values.map((value) => ({ ...value, id: this.knex.fn.uuid() })),
      'id'
    );
  }

  update(value: AnswerOption): Promise<number> {
    return this.table().where('id', value.id).update(without(value, 'id'));
  }

  upsert(values: AnswerOption[]): Promise<Record<string, string>> {
    return upsertBase(
      values,
      () => this.table().select(['id']),
      (steps) => this.insert(steps),
      (step) => this.update(step)
    );
  }
}
