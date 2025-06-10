import { getFacultyGroupListById } from './get';

export async function getFacultyGroupMapById(
  ids: string[]
): Promise<Map<string, string>> {
  const groups = await getFacultyGroupListById(new Set(ids));
  const result = new Map<string, string>();

  for (const { campusId, name } of groups) {
    result.set(campusId, name);
  }

  return result;
}
