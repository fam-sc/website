import { Lesson } from '@sc-fam/shared-schedule';

import { getMessage } from './messages';

function getMaxLineWidth(text: string): number {
  const lengths = text.split('\n').map((line) => line.length);

  return Math.max(...lengths);
}

function formatLink(
  value: { name: string; link?: string | null },
  linkEnabled: boolean
) {
  return value.link && linkEnabled
    ? `[${value.name}](${value.link})`
    : value.name;
}

function formatLesson(
  lesson: Lesson,
  withTime: boolean,
  linkEnabled: boolean = true
): string {
  let line = `📎 ${formatLink(lesson, linkEnabled)}`;
  line += `\n👨‍🏫 Викладач: ${formatLink(lesson.teacher, linkEnabled)}`;
  if (withTime) {
    line += `\n🕒 Час: ${lesson.time}`;
  }

  if (lesson.place) {
    line += `\n📍 Де: ${lesson.place}`;
  }

  return line;
}

export function formatLessonNotification(lessons: Lesson[]) {
  let text = getMessage(
    lessons.length === 1 ? 'lessons-started-singular' : 'lessons-started-plural'
  );
  text += '\n\n';
  text += lessons.map((lesson) => formatLesson(lesson, false)).join('\n\n');

  return text;
}

function formatMyDayLessonsBase(
  lessons: Lesson[],
  delimiter: string,
  linkEnabled: boolean = true
) {
  let text = getMessage('myday-title');
  text += '\n\n';
  text += lessons
    .map((lesson) => formatLesson(lesson, true, linkEnabled))
    .join(`\n\n*${delimiter}*\n\n`);

  return text;
}

export function formatMyDayLessons(lessons: Lesson[]) {
  const approx = formatMyDayLessonsBase(lessons, '', false);
  const maxLineWidth = getMaxLineWidth(approx);

  const delimiterWidth = Math.min(Math.floor(maxLineWidth / 2.25), 12);
  const delimiter = '﹏'.repeat(delimiterWidth);

  return formatMyDayLessonsBase(lessons, delimiter);
}
