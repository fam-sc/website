import type { Meta, StoryObj } from '@storybook/react';

import { ScheduleTile } from '.';

export default {
  component: ScheduleTile,
} satisfies Meta<typeof ScheduleTile>;

type Story = StoryObj<typeof ScheduleTile>;

export const Primary: Story = {
  args: {
    lesson: {
      name: 'Front-end розробка',
      teacher: {
        name: 'Борисенко Павло Борисович',
        link: 'https://pma.fpm.kpi.ua/uk/teachers/borisenko-pavlo-borisovich',
      },
      time: '8:30',
      place: '',
      type: 'lec',
    },
  },
};

export const PrimaryNow: Story = {
  args: {
    lesson: {
      name: 'Front-end розробка',
      teacher: {
        name: 'Борисенко Павло Борисович',
        link: 'https://pma.fpm.kpi.ua/uk/teachers/borisenko-pavlo-borisovich',
      },
      time: '8:30',
      place: '',
      type: 'lec',
    },
    isNow: true,
  },
};

export const PrimaryWithPlace: Story = {
  args: {
    lesson: {
      name: 'Front-end розробка',
      teacher: {
        name: 'Борисенко Павло Борисович',
        link: 'https://pma.fpm.kpi.ua/uk/teachers/borisenko-pavlo-borisovich',
      },
      time: '8:30',
      place: 'Десь',
      type: 'lab',
    },
  },
};
