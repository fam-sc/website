import type { Meta, StoryObj } from '@storybook/react';

import { InlineImageDropArea, InlineImageDropAreaProps } from '.';
import { fileToDataUrl } from '@/utils/fileTransformations';
import { useState } from 'react';

function Component(props: InlineImageDropAreaProps) {
  const [image, setImage] = useState<string>();

  return (
    <InlineImageDropArea
      {...props}
      imageSrc={image}
      onFile={(file) => {
        if (file === undefined) {
          setImage(undefined);
        } else {
          fileToDataUrl(file)
            .then((base64) => {
              setImage(base64);
            })
            .catch((error: unknown) => {
              console.error(error);
            });
        }
      }}
    />
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {
    style: { height: '400px' },
  },
};
