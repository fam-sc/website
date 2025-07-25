import { findNextDataBlock } from './parser.js';
import { Discipline, NameWithLink, Teacher } from './types.js';

const SITE_URL = 'https://pma.fpm.kpi.ua';

async function fetchPage(path: string): Promise<string> {
  const response = await fetch(`${SITE_URL}${path}`, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  if (response.status === 200) {
    return await response.text();
  }

  throw new Error(response.statusText);
}

function mapNameWithLink(items: NameWithLink[]): NameWithLink[] {
  return items.map(({ name, link }) => ({
    name,
    link: `${SITE_URL}${link}`,
  }));
}

export async function getTeachers(): Promise<Teacher[]> {
  const pageContent = await fetchPage('/uk/vikladachi');
  const teachersBlock = findNextDataBlock(pageContent, 'teachers_blocks');

  return mapNameWithLink(teachersBlock.props.people);
}

export async function getDisciplines(): Promise<Discipline[]> {
  const pageContent = await fetchPage('/uk/studentam/navchalni-distsiplini');
  const disciplineListBlock = findNextDataBlock(
    pageContent,
    'discipline_list_blocks'
  );

  return mapNameWithLink(disciplineListBlock.props.disciplines);
}
