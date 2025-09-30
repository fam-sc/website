import { generateRobots } from '@sc-fam/shared/index.js';
import { generatedAssetFactory } from '@sc-fam/shared-vite-plugins/generatedAsset';

import robotsFactory from '../src/app/robots';

export const robotsPlugin = generatedAssetFactory({
  pluginName: 'robots',
  outputName: 'robots.txt',
  contentType: 'text/plain',
  generator: (mode) => generateRobots(robotsFactory(mode)),
});
