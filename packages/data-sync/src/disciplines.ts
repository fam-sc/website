import { Repository } from '@sc-fam/data';
import { getDisciplines } from '@sc-fam/shared/api/pma/index.js';
import { Discipline } from '@sc-fam/shared/api/pma/types.js';

const SUFFIX_PATTERN = /.*?(\s*\(\d*\)\s*)$/;

function cleanDisciplineName(name: string): string {
  const match = name.match(SUFFIX_PATTERN);
  if (match) {
    return name.slice(0, name.length - match[1].length);
  }

  return name;
}

function cleanDisciplines(disciplines: Discipline[]): Discipline[] {
  const map: Record<string, Discipline | undefined> = {};

  for (const { name, link } of disciplines) {
    const cleanName = cleanDisciplineName(name);

    if (map[cleanName] === undefined) {
      map[cleanName] = { name: cleanName, link };
    }
  }

  return Object.values(map) as Discipline[];
}

export async function syncDisciplines() {
  const disciplines = await getDisciplines();

  const repo = Repository.openConnection();

  await repo.batch([
    repo.disciplines().deleteWhere({}),
    ...repo.disciplines().insertManyAction(cleanDisciplines(disciplines)),
  ]);
}
