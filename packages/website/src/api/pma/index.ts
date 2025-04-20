import { getPeopleFromTeachersPage } from './parser';
import { Teacher } from './types';

export async function getTeachers(): Promise<Teacher[]> {
  const response = await fetch('https://pma.fpm.kpi.ua/uk/vikladachi', {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  if (response.status === 200) {
    const pageContent = await response.text();

    return getPeopleFromTeachersPage(pageContent);
  }

  throw new Error(response.statusText);
}
