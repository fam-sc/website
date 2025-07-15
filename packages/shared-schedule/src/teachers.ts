import { findTeacherByName } from '@shared/api/intellect';
import { getIntellectProfileUrl } from '@shared/api/intellect/url';
import { getTeachers as getPmaTeachers } from '@shared/api/pma';
import { Teacher } from '@shared/api/pma/types';
import { convertToKeyMap } from '@shared/collections/keyMap';

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
