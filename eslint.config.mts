import react from 'eslint-plugin-react';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});

export default tseslint.config(
  {
    ignores: [
      'packages/website/.next',
      'packages/website/next-env.d.ts',
      'packages/website/next.config.ts',
      'packages/website/storybook-static',
      'packages/workers/worker-configuration.d.ts',
      'node_modules',
      'eslint.config.mts',
      'prettier.config.mjs',
      'vitest.config.ts',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  unicorn.configs.recommended,
  react.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        project: [
          './tsconfig.json',
          './packages/website/tsconfig.json',
          './packages/website/.storybook/tsconfig.json',
          './packages/workers/tsconfig.json',
        ],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^react', '^@?\\w'],
            [
              '^types(/.*|$)',
              '^utils(/.*|$)',
              '^api(/.*|$)',
              '^hooks(/.*|$)',
              '^theme(/.*|$)',
              '^components(/.*|$)',
            ],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^styles(/.*|$)', '^.+\\.?(scss)$'],
            ['^(assets)(/.*|$)'],
            ['^i18n(/.*|$)'],
            ['^/./(assets)(/.*|$)'],
          ],
        },
      ],
    },
  },
  ...compat.extends('next'),

  // prettier must be at the end
  prettier
);
