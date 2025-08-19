import { generatedAssetFactory } from '@sc-fam/shared-vite-plugins/generatedAsset';

import { manifest } from '../src/app/manifest';

export const manifestPlugin = generatedAssetFactory({
  pluginName: 'manifest',
  outputName: 'manifest.json',
  contentType: 'application/json',
  generator: () => JSON.stringify(manifest),
});
