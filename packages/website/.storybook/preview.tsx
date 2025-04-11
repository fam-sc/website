import type { Preview } from '@storybook/react';
import localFont from 'next/font/local';

import '../src/theme/global.scss';

const mursGothic = localFont({
  src: '../MursGothic-WideDark.ttf',
  preload: true,
  variable: '--font-murs-gothic',
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={mursGothic.variable}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
