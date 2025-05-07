import { findTeacherByName } from '../intellect';
import { getTeachers } from '../pma';
import { Teacher } from '../pma/types';

import { CachedExternalApi } from '@data/cache';
import { Repository } from '@data/repo';
import { convertToKeyMap } from '@/utils/keyMap';

export type TeacherMap = Map<string, Teacher>;

// 7 days
const INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

class TeachersExternalApi extends CachedExternalApi<TeacherMap> {
  private names: Set<string>;

  constructor(names: Set<string>, repo?: Repository) {
    super('schedule-teachers', INVALIDATE_TIME, repo);

    this.names = names;
  }

  protected async fetchFromRepo(repo: Repository): Promise<TeacherMap | null> {
    const teachers = await repo
      .scheduleTeachers()
      .findByNames([...this.names])
      .map(({ name, link }) => ({ name, link }))
      .toArray();

    return convertToKeyMap(teachers, 'name');
  }

  protected async fetchFromExternalApi(): Promise<TeacherMap> {
    const pmaTeachers = convertToKeyMap(await getTeachers(), 'name');

    const teachers = await Promise.all(
      [...this.names].map(async (name) => {
        const pmaTeacher = pmaTeachers.get(name);
        if (pmaTeacher !== undefined) {
          return pmaTeacher;
        }

        const intellectTeacher = await findTeacherByName(name);
        if (intellectTeacher === undefined) {
          return { name, link: null };
        }

        return { name, link: intellectTeacher.profile };
      })
    );

    return convertToKeyMap(teachers, 'name');
  }

  protected async putToRepo(repo: Repository, map: TeacherMap): Promise<void> {
    await repo.scheduleTeachers().insertOrUpdateMany([...map.values()]);
  }
}

export const resolveTeachers = CachedExternalApi.accessor(TeachersExternalApi);
