import type { Preview } from '@storybook/react';

import '../src/theme/global.scss';
import { NotificationWrapper } from '@/components/Notification';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div>
        <NotificationWrapper>
          <Story />
        </NotificationWrapper>
      </div>
    ),
  ],
};

export default preview;
