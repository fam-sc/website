import '../src/theme/global.scss';

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
          <Stub />
        </div>
      );
    },
  ],
};

export default preview;
