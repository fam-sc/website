import { findTeacherByName } from '../intellect';
import { getTeachers } from '../pma';
import { Teacher } from '../pma/types';

import { Repository } from '@/data/repo';
import { ScheduleTeacher } from '@/data/types/schedule';

export interface TeacherResolver extends AsyncDisposable {
  get(name: string): Promise<ScheduleTeacher | undefined>;
}

// 7 days
const INVALIDATE_TIME = 7 * 24 * 60 * 60 * 1000;

async function getPmaTeachersMap(): Promise<Map<string, Teacher>> {
  const pmaTeachers = await getTeachers();
  const result = new Map<string, Teacher>();

  for (const item of pmaTeachers) {
    result.set(item.name, item);
  }

  return result;
}

export async function createCachedTeacherResolver(
  repo: Repository
): Promise<TeacherResolver> {
  const lastUpdateTime = await repo.updateTime().getByType('schedule-teachers');
  const now = Date.now();

  if (now - lastUpdateTime < INVALIDATE_TIME) {
    return {
      async get(name) {
        return (await repo.scheduleTeachers().findByName(name)) ?? undefined;
      },
      [Symbol.asyncDispose]: () => Promise.resolve(),
    };
  }

  const pmaTeachers = await getPmaTeachersMap();
  const localCache = new Map<string, Teacher>();

  return {
    get: async (name) => {
      let result = localCache.get(name);
      if (result !== undefined) {
        return result;
      }

      result = pmaTeachers.get(name);
      if (result === undefined) {
        const intellectTeacher = await findTeacherByName(name);
        if (intellectTeacher === undefined) {
          return;
        }

        result = { name, link: intellectTeacher.profile };
      }

      localCache.set(name, result);
      await repo.scheduleTeachers().insertOrUpdate(result);

      return result;
    },
    [Symbol.asyncDispose]: async () => {
      await repo.updateTime().setByType('schedule-teachers', Date.now());
    },
  };
}
