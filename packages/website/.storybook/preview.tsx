import type { Preview } from '@storybook/react';

import '../src/theme/global.scss';
import { NotificationWrapper } from '@/components/Notification';
import { createRoutesStub } from 'react-router';

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
