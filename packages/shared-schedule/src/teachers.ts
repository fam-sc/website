import { findTeacherByName } from '@sc-fam/shared/api/intellect/index.js';
import { getIntellectProfileUrl } from '@sc-fam/shared/api/intellect/url.js';
import { getTeachers as getPmaTeachers } from '@sc-fam/shared/api/pma/index.js';
import { Teacher } from '@sc-fam/shared/api/pma/types.js';
import { convertToKeyMap } from '@sc-fam/shared/collections';

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
