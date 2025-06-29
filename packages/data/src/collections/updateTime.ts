import { DataQuery } from '../sqlite/query';
import { TableDescriptor } from '../sqlite/types';
import { UpdateTime, UpdateTimeType } from '../types/meta';
import { EntityCollection } from './base';

export class UpdateTimeCollection extends EntityCollection<UpdateTime>(
  'update_times'
) {
  static descriptor(): TableDescriptor<UpdateTime> {
    return {
      type: 'TEXT NOT NULL PRIMARY KEY',
      time: 'INTEGER NOT NULL',
    };
  }

  getByTypeAction(type: UpdateTimeType): DataQuery<number> {
    return this.findOneWhereAction({ type }).map((result) => result?.time ?? 0);
  }

  async getByType(type: UpdateTimeType): Promise<number> {
    const value = await this.findOneWhere({ type });

    return value?.time ?? 0;
  }

  setByType(type: UpdateTimeType, time: number) {
    return this.insertOrReplaceAction({ type, time });
  }
}
