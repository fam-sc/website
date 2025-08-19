/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-scss', 'stylelint-config-standard-scss'],
  ignoreFiles: [
    '**/node_modules',
    'packages/website/build/**',
    'packages/website/storybook-static/**',
    'packages/posvyata/build/**',
    'coverage/**',
  ],
  rules: {
    'selector-class-pattern': null,
    'declaration-empty-line-before': null,
    'value-keyword-case': null,
    'scss/dollar-variable-pattern': null,
    'media-feature-range-notation': null,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
  },
};
