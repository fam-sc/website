import type { Meta, StoryObj } from '@storybook/react';

import { ScheduleGrid } from '.';

export default {
  component: ScheduleGrid,
} satisfies Meta<typeof ScheduleGrid>;

type Story = StoryObj<typeof ScheduleGrid>;

export const Primary: Story = {
  args: {
    currentLesson: { day: 1, time: '12:20' },
    week: [
      {
        day: 1,
        lessons: [
          {
            teacher: {
              name: 'Ладогубець Тетяна Сергіївна',
              link: 'https://pma.fpm.kpi.ua/teachers/ladogubets-tetyana-sergiyivna',
            },
            name: 'Методи оптимізації',
            place: '',
            time: '8:30',
            type: 'lec',
            link: 'https://zoom.us/48743433437473843874388347384783',
          },
          {
            teacher: {
              name: 'Дмитренко Олександра Анатоліївна',
              link: 'https://pma.fpm.kpi.ua/teachers/dmitrenko-oleksandra-anatoliyivna',
            },
            name: 'Бази даних',
            place: '',
            time: '10:25',
            type: 'lec',
            link: 'https://zoom.us/48743433437473843874388347384783',
          },
          {
            teacher: {
              name: 'Чертов Олег Романович',
              link: 'https://pma.fpm.kpi.ua/teachers/chertov-oleg-romanovich',
            },
            name: 'Основи машинного навчання',
            place: '',
            time: '12:20',
            type: 'lec',
          },
        ],
      },
      {
        day: 2,
        lessons: [
          {
            teacher: {
              name: 'Полукаров Юрій Олексійович',
              link: 'https://intellect.kpi.ua/profile/pyo7',
            },
            name: 'БЖД та цивільний захист',
            place: '',
            time: '8:30',
            type: 'lec',
          },
          {
            teacher: {
              name: 'Муханова Олена Миколаївна',
              link: 'https://intellect.kpi.ua/profile/mom66',
            },
            name: 'Практичний курс іноземної мови професійного спрямування. Частина 1',
            place: '',
            time: '10:25',
            type: 'prac',
          },
          {
            teacher: {
              name: 'Муханова Олена Миколаївна',
              link: 'https://intellect.kpi.ua/profile/mom66',
            },
            name: 'Практичний курс іноземної мови професійного спрямування. Частина 1',
            place: '',
            time: '12:20',
            type: 'prac',
          },
          {
            teacher: {
              name: 'Громова Вікторія Вікторівна',
              link: 'https://pma.fpm.kpi.ua/teachers/gromova-viktoriya-viktorivna',
            },
            name: 'Front-end розробка',
            place: '',
            time: '14:15',
            type: 'lab',
          },
        ],
      },
      {
        day: 3,
        lessons: [
          {
            teacher: {
              name: 'Борисенко Павло Борисович',
              link: 'https://pma.fpm.kpi.ua/teachers/borisenko-pavlo-borisovich',
            },
            name: 'Front-end розробка',
            place: '',
            time: '8:30',
            type: 'lec',
          },
          {
            teacher: {
              name: 'Тавров Данило Юрійович',
              link: 'https://pma.fpm.kpi.ua/teachers/tavrov-danilo-yuriyovich',
            },
            name: 'Аналіз даних',
            place: '',
            time: '10:25',
            type: 'lec',
          },
          {
            teacher: {
              name: 'Лось Валерій Миколайович',
              link: 'https://pma.fpm.kpi.ua/teachers/los-valeriy-mikolayovich',
            },
            name: 'Рівняння математичної фізики',
            place: '',
            time: '12:20',
            type: 'lec',
          },
        ],
      },
      {
        day: 4,
        lessons: [
          {
            teacher: {
              name: 'Рудник Людмила Іванівна',
              link: 'https://intellect.kpi.ua/profile/rli4',
            },
            name: 'Інформаційна безпека',
            place: '',
            time: '10:25',
            type: 'prac',
          },
          {
            teacher: {
              name: 'Жук Іван Сергійович',
              link: 'https://pma.fpm.kpi.ua/teachers/zhuk-ivan-sergiyovich',
            },
            name: 'Основи машинного навчання',
            place: '',
            time: '12:20',
            type: 'prac',
          },
          {
            teacher: {
              name: 'Жук Іван Сергійович',
              link: 'https://pma.fpm.kpi.ua/teachers/zhuk-ivan-sergiyovich',
            },
            name: 'Бази даних',
            place: '',
            time: '14:15',
            type: 'lab',
          },
          {
            teacher: {
              name: 'Полукаров Юрій Олексійович',
              link: 'https://intellect.kpi.ua/profile/pyo7',
            },
            name: 'БЖД та цивільний захист',
            place: '',
            time: '8:30',
            type: 'prac',
          },
          {
            teacher: {
              name: 'Качинська Наталія Федорівна',
              link: 'https://intellect.kpi.ua/profile/knf',
            },
            name: 'БЖД та цивільний захист',
            place: '',
            time: '8:30',
            type: 'prac',
          },
        ],
      },
      { day: 5, lessons: [] },
      { day: 6, lessons: [] },
    ],
  },
};
