import '../src/theme/global.scss';

import { NotificationWrapper } from '@sc-fam/shared-ui';
import type { Preview } from '@storybook/react';
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
