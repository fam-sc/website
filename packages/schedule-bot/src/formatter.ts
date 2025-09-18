import { Lesson } from '@sc-fam/shared-schedule';

import { getMessage } from './messages';

type LessonFormatOptions = {
  withTime?: boolean;
  withLinks?: boolean;
  withLessonLink?: boolean;
};

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

function formatLesson(lesson: Lesson, options?: LessonFormatOptions): string {
  const withLinks = options?.withLinks ?? true;

  let line = `📎 ${formatLink(lesson, withLinks && (options?.withLessonLink ?? true))}`;
  line += `\n👨‍🏫 Викладач: ${formatLink(lesson.teacher, withLinks)}`;

  if (options?.withTime ?? true) {
    line += `\n🕒 Час: ${lesson.time}`;
  }

  if (lesson.place) {
    line += `\n📍 Де: ${lesson.place}`;
  }

  return line;
}

export function formatLessonNotification(
  lessons: Lesson[],
  options?: Pick<LessonFormatOptions, 'withLessonLink'>
) {
  const formatOptions = { ...options, withTime: false };

  let text = getMessage(
    lessons.length === 1 ? 'lessons-started-singular' : 'lessons-started-plural'
  );
  text += '\n\n';
  text += lessons
    .map((lesson) => formatLesson(lesson, formatOptions))
    .join('\n\n');

  return text;
}

function formatMyDayLessonsBase(
  lessons: Lesson[],
  delimiter: string,
  options?: Omit<LessonFormatOptions, 'withTime'>
) {
  const formatOptions = { withTime: true, ...options };

  let text = getMessage('myday-title');
  text += '\n\n';
  text += lessons
    .map((lesson) => formatLesson(lesson, formatOptions))
    .join(`\n\n*${delimiter}*\n\n`);

  return text;
}

export function formatMyDayLessons(
  lessons: Lesson[],
  options?: Pick<LessonFormatOptions, 'withLessonLink'>
) {
  const approx = formatMyDayLessonsBase(lessons, '', { withLinks: false });
  const maxLineWidth = getMaxLineWidth(approx);

  const delimiterWidth = Math.min(Math.floor(maxLineWidth / 2.25), 12);
  const delimiter = '﹏'.repeat(delimiterWidth);

  return formatMyDayLessonsBase(lessons, delimiter, options);
}
