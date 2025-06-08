import path from 'node:path';
import { StorybookConfig } from 'storybook/internal/types';

// Storybook cannot find a module without this helper.
function getAbsolutePath(packageName: string) {
  // eslint-disable-next-line unicorn/prefer-module
  return path.dirname(require.resolve(path.join(packageName, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-actions', '@storybook/addon-a11y'].map((name) =>
    getAbsolutePath(name)
  ),
  framework: getAbsolutePath('@storybook/nextjs'),
  staticDirs: ['../public'],
};

export default config;
