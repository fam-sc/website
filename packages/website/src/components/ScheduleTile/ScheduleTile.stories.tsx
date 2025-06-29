import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { ScheduleTile, ScheduleTileProps } from '.';

function Component({ lesson: initialLesson, ...rest }: ScheduleTileProps) {
  const [lesson, setLesson] = useState(initialLesson);

  return (
    <ScheduleTile
      lesson={lesson}
      onLinkChanged={(link) => {
        setLesson((lesson) => ({ ...lesson, link }));
      }}
      {...rest}
    />
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

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

export const Now: Story = {
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

export const WithPlace: Story = {
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

export const Editable: Story = {
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
      link: 'https://zoom.us',
    },
    isEditable: true,
  },
};

export const EditableNoLink: Story = {
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
    isEditable: true,
  },
};
