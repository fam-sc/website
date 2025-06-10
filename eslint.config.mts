import react from 'eslint-plugin-react';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'packages/website/storybook-static',
      'packages/website/build',
      'packages/website/.react-router',
      '**/*/worker-configuration.d.ts',
      '*/**/dist/',
      '*/**/vite.config.ts',
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
  reactHooks.configs['recommended-latest'],
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
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
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'import/no-anonymous-default-export': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-negated-condition': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  // prettier must be at the end
  prettier
);
