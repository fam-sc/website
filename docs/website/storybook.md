The `website` package uses Storybook for showing React components in isolation.

> [!CAUTION]
> All components should have a story. The exceptions are components that are never used in isolation, i.e. simple wrappers (`BaseFileDropArea`)

## CLI

Run Storybook in dev mode:

```sh
yarn storybook:start
```

Build Storybook:

```sh
yarn storybook:build
```
