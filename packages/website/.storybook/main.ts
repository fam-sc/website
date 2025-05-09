import type { StorybookConfig } from '@storybook/nextjs';
import path from 'node:path';

// Storybook cannot find a module without this helper.
function getAbsolutePath(packageName: string) {
  // eslint-disable-next-line unicorn/prefer-module
  return path.dirname(require.resolve(path.join(packageName, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
  "c:/Users/ACER/website/packages/website/**/*.stories.@(js|jsx|ts|tsx)"
],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ].map((name) => getAbsolutePath(name)),
  framework: getAbsolutePath('@storybook/nextjs'),
  staticDirs: ['../public'],
  docs: {
    autodocs: false,
  },
};

export default config;
