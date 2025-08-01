import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Time } from '@/utils/time';

import { TimePicker, TimePickerProps } from '.';

function Component(props: TimePickerProps) {
  const [time, setTime] = useState<Time>('00:00');

  return <TimePicker {...props} time={time} onTimeChanged={setTime} />;
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
