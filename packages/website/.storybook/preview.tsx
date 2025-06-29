import '../src/theme/global.scss';

import type { Preview } from '@storybook/react';
import { createRoutesStub } from 'react-router';

import { NotificationWrapper } from '@/components/Notification';

const preview: Preview = {
  decorators: [
    (Story) => {
      const Stub = createRoutesStub([
        {
          path: '/',
          Component: () => <Story />,
        },
      ]);

      return (
        <div>
          <NotificationWrapper>
            <Stub />
          </NotificationWrapper>
        </div>
      );
    },
  ],
};

export default preview;
