import react from 'eslint-plugin-react';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'packages/website/storybook-static',
      'packages/website/build',
      'packages/website/.react-router',
      'packages/posvyata/build',
      'packages/posvyata/.react-router',
      '**/*/worker-configuration.d.ts',
      '*/**/dist/',
      '*/**/vite.config.ts',
      '*/**/.wrangler',
      'node_modules',
      'eslint.config.mts',
      'vitest.config.ts',
      'coverage',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  unicorn.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
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
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-misused-spread': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/no-magic-array-flat-depth': 'off',
      'import/no-anonymous-default-export': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreVoidReturningFunctions: true,
        },
      ],
    },
  },
  // prettier must be at the end
  prettier
);
