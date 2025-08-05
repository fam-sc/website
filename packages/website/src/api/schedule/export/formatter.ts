import { Lesson } from '@sc-fam/shared-schedule';

function htmlLink(name: string, link: string) {
  return `<a href="${link}">${name}</a>`;
}

function optionalLink(value: { name: string; link?: string | null }): string {
  return value.link ? htmlLink(value.name, value.link) : value.name;
}

export function createLessonDescription(lesson: Lesson) {
  const { teacher, link } = lesson;

  let result = `<b>Викладач:</b> ${optionalLink(teacher)}`;
  if (link) {
    result += `<br/><b>Посилання</b>: ${htmlLink(link, link)}`;
  }

  return result;
}
