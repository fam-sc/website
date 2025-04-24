import { findNextDataBlock } from './parser';
import { Discipline, Teacher } from './types';

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  if (response.status === 200) {
    return await response.text();
  }

  throw new Error(response.statusText);
}

export async function getTeachers(): Promise<Teacher[]> {
  const pageContent = await fetchPage('https://pma.fpm.kpi.ua/uk/vikladachi');
  const teachersBlock = findNextDataBlock(pageContent, 'teachers_blocks');

  return teachersBlock.props.people;
}

export async function getDisciplines(): Promise<Discipline[]> {
  const pageContent = await fetchPage(
    'https://pma.fpm.kpi.ua/uk/studentam/navchalni-distsiplini'
  );
  const disciplineListBlock = findNextDataBlock(
    pageContent,
    'discipline_list_blocks'
  );

  return disciplineListBlock.props.disciplines;
}
