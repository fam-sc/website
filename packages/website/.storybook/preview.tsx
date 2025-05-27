import type { Preview } from '@storybook/react';
import localFont from 'next/font/local';

import '../src/theme/global.scss';
import { NotificationWrapper } from '@/components/Notification';

const mursGothic = localFont({
  src: [
    { path: '../MursGothic-KeyRegular.otf', weight: '400', style: 'normal' },
    { path: '../MursGothic-WideMedium.otf', weight: '500', style: 'normal' },
    { path: '../MursGothic-WideDark.ttf', weight: '700', style: 'normal' },
  ],
  preload: true,
  variable: '--font-murs-gothic',
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={mursGothic.variable}>
        <NotificationWrapper>
          <Story />
        </NotificationWrapper>
      </div>
    ),
  ],
};

export default preview;
