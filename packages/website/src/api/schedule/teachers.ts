import { findTeacherByName } from '../intellect';
import { getTeachers as getPmaTeachers } from '../pma';
import { Teacher } from '../pma/types';

import { convertToKeyMap } from '@/utils/keyMap';
import { getIntellectProfileUrl } from '../intellect/url';

export type TeacherMap = Map<string, Teacher>;

export async function getTeachers(names: Iterable<string>): Promise<Teacher[]> {
  const pmaTeachers = convertToKeyMap(await getPmaTeachers(), 'name');

  const teachers = await Promise.all(
    [...names].map(async (name) => {
      const pmaTeacher = pmaTeachers.get(name);
      if (pmaTeacher !== undefined) {
        return pmaTeacher;
      }

      const intellectTeacher = await findTeacherByName(name);
      if (intellectTeacher === undefined) {
        return { name, link: null };
      }

      return {
        name,
        link: getIntellectProfileUrl(intellectTeacher.userIdentifier),
      };
    })
  );

  return teachers;
}
