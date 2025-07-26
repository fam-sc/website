import { LessonType, ScheduleWithTeachers } from '@sc-fam/data';
import { Teacher } from '@sc-fam/shared/api/pma/types.js';
import { expect, test } from 'vitest';

import { lessonId } from './lesson';
import {
  campusScheduleToDataSchedule,
  dataScheduleToApiSchedule,
} from './transform';
import { Schedule } from './types';

test('dataScheduleToApiSchedule', () => {
  const actual = dataScheduleToApiSchedule({
    groupCampusId: '123',
    lastUpdateTime: 0,
    links: { [lessonId('lab', 'Lesson 1', 'Teacher 1')]: 'link' },
    weeks: [
      [
        {
          day: 1,
          lessons: [
            {
              name: 'Lesson 1',
              place: 'Place 1',
              teacher: { name: 'Teacher 1', link: 'Teacher link 1' },
              time: '10:25',
              type: LessonType.LAB,
            },
          ],
        },
      ],
      [
        {
          day: 2,
          lessons: [
            {
              name: 'Lesson 2',
              place: 'Place 2',
              teacher: { name: 'Teacher 2', link: null },
              time: '10:25',
              type: LessonType.LECTURE,
            },
          ],
        },
      ],
    ],
  });

  const expected: Schedule = {
    groupCampusId: '123',
    weeks: [
      [
        {
          day: 1,
          lessons: [
            {
              name: 'Lesson 1',
              place: 'Place 1',
              teacher: { name: 'Teacher 1', link: 'Teacher link 1' },
              time: '10:25',
              type: 'lab',
              link: 'link',
            },
          ],
        },
      ],
      [
        {
          day: 2,
          lessons: [
            {
              name: 'Lesson 2',
              place: 'Place 2',
              teacher: { name: 'Teacher 2', link: null },
              time: '10:25',
              type: 'lec',
            },
          ],
        },
      ],
    ],
  };

  expect(actual).toEqual(expected);
});

test('campusScheduleToDataSchedule', () => {
  const teachers: Teacher[] = [{ name: 'Teacher 1', link: 'link 1' }];
  const actual = campusScheduleToDataSchedule(
    {
      groupCode: '123',
      scheduleFirstWeek: [
        {
          day: 'Пн',
          pairs: [
            {
              name: 'Lesson 1',
              lecturerId: '',
              place: 'Place 1',
              tag: 'lec',
              teacherName: 'Teacher 1',
              time: '10:25',
              type: 'Лек on-line',
            },
          ],
        },
      ],
      scheduleSecondWeek: [
        {
          day: 'Вв',
          pairs: [
            {
              name: 'Lesson 2',
              lecturerId: '',
              place: 'Place 2',
              tag: 'lab',
              teacherName: 'Teacher 2',
              time: '10:25',
              type: 'Лаб on-line',
            },
          ],
        },
      ],
    },
    teachers
  );

  const expected: ScheduleWithTeachers = {
    groupCampusId: '123',
    lastUpdateTime: 0,
    links: undefined,
    weeks: [
      [
        {
          day: 1,
          lessons: [
            {
              name: 'Lesson 1',
              place: 'Place 1',
              teacher: { name: 'Teacher 1', link: 'link 1' },
              time: '10:25',
              type: LessonType.LECTURE,
            },
          ],
        },
      ],
      [
        {
          day: 2,
          lessons: [
            {
              name: 'Lesson 2',
              place: 'Place 2',
              teacher: { name: 'Teacher 2', link: null },
              time: '10:25',
              type: LessonType.LAB,
            },
          ],
        },
      ],
    ],
  };

  expect(actual).toEqual(expected);
});
